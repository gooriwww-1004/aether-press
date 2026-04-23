// src/app/page.tsx
import React from 'react';
import Header from '@/components/Header';
import NovelSection from '@/components/NovelSection';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import MediaSection from '@/components/MediaSection';
import { createClient } from '@supabase/supabase-js';
import { fetchPlaylistVideos } from '@/lib/youtube';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

export default async function Home() {
  const { data: newsPosts } = await supabase
    .from('posts')
    .select('id, title, summary, source_name, external_url')
    .eq('content_type', 'external_link')
    .order('created_at', { ascending: false })
    .limit(6);

  const { data: aiPosts } = await supabase
    .from('posts')
    .select('id, title, content, author_name, category')
    .eq('content_type', 'ai_created')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: adPosts } = await supabase
    .from('posts')
    .select('title, summary, ad_link_url, ad_sponsor')
    .eq('content_type', 'ad')
    .limit(5);

  // 재생목록 3개에서 랜덤 영상 1개씩
  const videos = await fetchPlaylistVideos();

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

        {/* 뉴스 */}
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

        {/* 광고 */}
        <AdBanner ads={ads} variant="horizontal" />

        {/* 뮤직 픽스 */}
        <MediaSection videos={videos} />

        {/* AI 창작 */}
        <NovelSection data={aiPosts} />

      </main>
      <Footer />
    </div>
  );
}

const NewsCard = ({
  source, title, summary, url,
}: {
  source: string; title: string; summary: string; url: string;
}) => {
  let hostname = '#';
  try { hostname = new URL(url).hostname; } catch {}
  const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

  return (
    <div className="group border-b border-gray-100 py-6 font-sans">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center gap-2 mb-2">
          <img src={favicon} alt="" width={12} height={12} className="grayscale opacity-50" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {source}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 font-light">{summary}</p>
      </a>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="border border-dashed border-gray-200 rounded py-12 text-center">
    <p className="text-gray-400 text-sm font-light">{message}</p>
  </div>
);
