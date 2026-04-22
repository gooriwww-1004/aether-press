// src/lib/rss.ts
// Aether Press · RSS 파서
// 외부 뉴스 사이트의 XML 피드를 JSON으로 변환합니다

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

// -------------------------------------------------------
// 구독할 RSS 피드 목록
// 무료 공개 피드만 사용 (CORS 우회를 위해 서버사이드에서만 호출)
// -------------------------------------------------------
const RSS_FEEDS = [
  // 기술/AI 글로벌
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',       name: 'BBC Technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', name: 'NYT Technology' },
  { url: 'https://www.theverge.com/rss/index.xml',                 name: 'The Verge' },
  // 한국어
  { url: 'https://www.yonhapnewstv.co.kr/rss/science.xml',        name: '연합뉴스 과학' },
  { url: 'https://rss.etnews.com/Section901.xml',                  name: '전자신문' },
];

// -------------------------------------------------------
// 메인 함수: 모든 피드 수집 → 최대 8개 반환
// -------------------------------------------------------
export async function fetchRSSFeeds(): Promise<RSSItem[]> {
  const items: RSSItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'AetherPress/1.0 (+https://aether.press)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        // 서버 캐시 1시간
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`[RSS] ${feed.name} responded ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const parsed = parseRSSXML(xml, feed.name);
      // 피드당 최대 2개
      items.push(...parsed.slice(0, 2));
    } catch (err) {
      console.error(`[RSS] ${feed.name} fetch failed:`, err);
    }
  }

  // 최신순 정렬 후 상위 8개
  return items
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, 8);
}

// -------------------------------------------------------
// XML 파서: 정규식 기반 (외부 라이브러리 불필요)
// -------------------------------------------------------
function parseRSSXML(xml: string, source: string): RSSItem[] {
  const items: RSSItem[] = [];

  // <item> 또는 <entry> (Atom 피드) 블록 추출
  const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title       = extractCDATA(block, 'title');
    const link        = extractLink(block);
    const description = extractCDATA(block, 'description') ||
                        extractCDATA(block, 'summary') ||
                        extractCDATA(block, 'content');
    const pubDate     = extractCDATA(block, 'pubDate') ||
                        extractCDATA(block, 'published') ||
                        extractCDATA(block, 'updated');

    if (title && link) {
      items.push({
        title:       sanitizeText(title),
        link:        link.trim(),
        description: sanitizeText(description).slice(0, 300),
        pubDate:     pubDate.trim(),
        source,
      });
    }
  }

  return items;
}

// CDATA 또는 일반 태그에서 텍스트 추출
function extractCDATA(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`,
    'i'
  );
  const m = xml.match(re);
  return (m?.[1] ?? m?.[2] ?? '').trim();
}

// <link> 태그 또는 href 속성에서 URL 추출
function extractLink(xml: string): string {
  // Atom: <link href="..." />
  const atomHref = xml.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atomHref) return atomHref[1];

  // RSS 2.0: <link>url</link>
  const rssLink = xml.match(/<link>([^<]+)<\/link>/i);
  if (rssLink) return rssLink[1];

  // <guid> fallback
  const guid = xml.match(/<guid[^>]*>([^<]+)<\/guid>/i);
  if (guid && guid[1].startsWith('http')) return guid[1];

  return '';
}

// HTML 태그 · 특수문자 제거
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
