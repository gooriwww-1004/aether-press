// src/app/page.tsx
// Aether Press · 메인 페이지
// ISR: 1시간마다 재생성 (cron 주기와 맞춤)

import React from 'react';
import Header from '@/components/Header';
import NovelSection from '@/components/NovelSection';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { createClient } from '@supabase/supabase-js';

// 빌드 타임에는 public key 사용 / 서버사이드 revalidate
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ISR: 1시간마다 재빌드
export const revalidate = 60;

export default async function Home() {
  const today = new Date().toISOString().split('T')[0];

  // 1. 뉴스 (최신 6개)
  const { data: newsPosts } = await supabase
    .from('posts')
    .select('id, title, summary, source_name, external_url')
    .eq('content_type', 'external_link')
    .order('created_at', { ascending: false })
    .limit(6);

  // 2. AI 창작물 (오늘 날짜 기준 최신 4개)
  const { data: aiPosts } = await supabase
    .from('posts')
    .select('id, title, content, author_name, category')
    .eq('content_type', 'ai_created')
    .order('created_at', { ascending: false })
    .limit(4);

  // 3. 광고
  const { data: adPosts } = await supabase
    .from('posts')
    .select('title, summary, ad_link_url, ad_sponsor')
    .eq('content_type', 'ad')
    .limit(5);

  const ads = adPosts?.map((a) => ({
    title:   a.title,
    summary: a.summary,
    link:    a.ad_link_url ?? '#',
    sponsor: a.ad_sponsor ?? 'Aether Press',
  }));

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <Header />

      <main className="w-full max-w-screen-xl px-4 md:px-8">
        {/* ── 뉴스 섹션 ── */}
        <section id="news" className="mb-12">
          <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-2 inline-block tracking-tight">
            LATEST NEWS
          </h2>
          {newsPosts && newsPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-2">
              {newsPosts.map((post) => (
                <NewsCard
                  key={post.id}
                  source={post.source_name}
                  title={post.title}
                  summary={post.summary}
                  url={post.external_url}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="오늘의 뉴스를 수집 중입니다. 잠시 후 새로고침 해주세요." />
          )}
        </section>

        {/* ── 광고 배너 (뉴스-창작 섹션 사이) ── */}
        <AdBanner ads={ads} variant="horizontal" />

        {/* ── AI 창작 섹션 ── */}
        <NovelSection data={aiPosts} />
      </main>

      <Footer />
    </div>
  );
}

// ── 뉴스 카드 ──
const NewsCard = ({
  source,
  title,
  summary,
  url,
}: {
  source: string;
  title: string;
  summary: string;
  url: string;
}) => {
  let hostname = '#';
  try { hostname = new URL(url).hostname; } catch { /* 잘못된 URL 무시 */ }
  const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

  return (
    <div className="group border-b border-gray-100 py-6 font-sans">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center gap-2 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={favicon} alt="" width={12} height={12} className="grayscale opacity-50" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {source}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 font-light">{summary}</p>
      </a>
    </div>
  );
};

// ── 데이터 없을 때 안내 ──
const EmptyState = ({ message }: { message: string }) => (
  <div className="border border-dashed border-gray-200 rounded py-12 text-center">
    <p className="text-gray-400 text-sm font-light">{message}</p>
  </div>
);
