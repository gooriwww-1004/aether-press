import React from 'react';

// 데이터를 받기 위한 인터페이스 설정
interface NovelSectionProps {
  data: any[] | null;
}

export default function NovelSection({ data }: NovelSectionProps) {
  // 데이터가 없을 경우를 대비한 기본값 설정
  const displayPosts = data && data.length > 0 ? data : [
    {
      author_name: "백서아",
      title: "데이터 로딩 중...",
      content: "에테르 프레스의 첫 번째 이야기를 준비하고 있습니다.",
      category: "연재소설"
    }
  ];

  return (
    <section id="creative" className="-mx-4 md:-mx-8 px-4 md:px-8 py-24 bg-[#fcfcfc] border-y border-gray-100 mb-20 w-full">
      <div className="max-w-4xl mx-auto font-serif-kr px-4">
        <h2 className="text-center text-3xl font-bold mb-20 text-slate-900 underline underline-offset-[12px] decoration-gray-300">
          에테르 문학 & 라이프
        </h2>
        
        <div className="space-y-32">
          {displayPosts.map((post, index) => (
            <article key={index} className="relative">
              <span className="absolute -top-8 left-0 text-blue-800 font-bold text-[10px] tracking-[0.3em] uppercase font-sans">
                {post.category} by {post.author_name}
              </span>
              <h3 className="text-4xl font-bold mt-2 mb-8 leading-tight text-black">
                {post.title}
              </h3>
              <p className="text-xl text-slate-800 leading-relaxed italic opacity-95 whitespace-pre-wrap">
                "{post.content}"
              </p>
              <div className="mt-10 flex gap-4 font-sans">
                <button className="px-6 py-2 bg-black text-white text-[11px] font-bold hover:bg-blue-800 transition">전문 읽기</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}