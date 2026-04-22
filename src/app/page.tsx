import React from 'react';
import Header from "@/components/Header";
import NovelSection from "@/components/NovelSection";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // 1. 외부 뉴스 데이터 가져오기 (그림 1)
  const { data: newsPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('content_type', 'external_link')
    .order('created_at', { ascending: false })
    .limit(6);

  // 2. AI 창작물 데이터 가져오기 (그림 2)
  const { data: aiPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('content_type', 'ai_created')
    .order('created_at', { ascending: false })
    .limit(2);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <Header />
      
      <main className="w-full max-w-screen-xl px-4 md:px-8">
        {/* 뉴스 섹션에 실제 데이터 그림 넣기 */}
        <section id="news" className="mb-20">
          <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-2 inline-block">LATEST NEWS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
            {newsPosts?.map((post) => (
              <NewsCard 
                key={post.id}
                source={post.source_name}
                title={post.title}
                summary={post.summary}
                url={post.external_url}
              />
            ))}
          </div>
        </section>

        {/* AI 창작 섹션도 같은 방식으로 post 데이터를 넘겨줍니다 */}
        <NovelSection data={aiPosts} />

        {/* ... 중략 ... */}
      </main>
      <Footer />
    </div>
  );
}

// 뉴스 카드 컴포넌트 (동일)
const NewsCard = ({ source, title, summary, url }: any) => {
  const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
  return (
    <div className="group border-b border-gray-100 py-6 font-sans">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center gap-2 mb-2">
          <img src={favicon} alt="" className="w-3 h-3 grayscale opacity-50" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{source}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 font-light">{summary}</p>
      </a>
    </div>
  );
};