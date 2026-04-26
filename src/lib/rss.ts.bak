// src/lib/rss.ts
export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

const RSS_FEEDS = [
  // 글로벌
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',            name: 'BBC Technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', name: 'NYT Technology' },
  { url: 'https://www.theverge.com/rss/index.xml',                      name: 'The Verge' },
  // 구글 뉴스 (한국어 AI/기술)
  { url: 'https://news.google.com/rss/search?q=AI+인공지능&hl=ko&gl=KR&ceid=KR:ko', name: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=tech+technology&hl=ko&gl=KR&ceid=KR:ko', name: 'Google News Tech' },
  // 네이버 뉴스 (RSS 공개 피드)
  { url: 'https://www.yonhapnewstv.co.kr/rss/it.xml',   name: '연합뉴스 IT' },
  { url: 'https://rss.etnews.com/Section901.xml',        name: '전자신문' },
  { url: 'https://www.hani.co.kr/rss/economy/',          name: '한겨레 경제' },
];

export async function fetchRSSFeeds(): Promise<RSSItem[]> {
  const items: RSSItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'AetherPress/1.0 (+https://aether.press)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        next: { revalidate: 3600 },
      });
      if (!res.ok) { console.warn(`[RSS] ${feed.name} ${res.status}`); continue; }
      const xml = await res.text();
      const parsed = parseRSSXML(xml, feed.name);
      items.push(...parsed.slice(0, 2));
    } catch (err) {
      console.error(`[RSS] ${feed.name} failed:`, err);
    }
  }

  return items
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, 12);
}

function parseRSSXML(xml: string, source: string): RSSItem[] {
  const items: RSSItem[] = [];
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
        description: sanitizeText(description).slice(0, 400),
        pubDate:     pubDate.trim(),
        source,
      });
    }
  }
  return items;
}

function extractCDATA(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`, 'i'
  );
  const m = xml.match(re);
  return (m?.[1] ?? m?.[2] ?? '').trim();
}

function extractLink(xml: string): string {
  const atomHref = xml.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atomHref) return atomHref[1];
  const rssLink = xml.match(/<link>([^<]+)<\/link>/i);
  if (rssLink) return rssLink[1];
  const guid = xml.match(/<guid[^>]*>([^<]+)<\/guid>/i);
  if (guid && guid[1].startsWith('http')) return guid[1];
  return '';
}

function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
