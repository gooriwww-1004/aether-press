'use client';

import React, { useState } from 'react';

interface Post {
  id?: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
}

interface NovelSectionProps {
  data: Post[] | null;
}

function cleanContent(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/내용[:：]\s*([\s\S]+)/);
  if (match) return match[1].trim();
  return raw.replace(/^제목[:：][^\n]*\n?/, '').trim();
}

function cleanTitle(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/제목[:：]\s*(.+)/);
  if (match) return match[1].trim();
  return raw.trim();
}

export default function NovelSection({ data }: NovelSectionProps) {
  const [modalPost, setModalPost] = useState<Post | null>(null);

  const displayPosts = data && data.length > 0 ? data : [
    {
      author_name: '백서아',
      title: '데이터 로딩 중...',
      content: '에테르 프레스의 첫 번째 이야기를 준비하고 있습니다.',
      category: '연재소설',
    },
  ];

  // /board/write?title=xxx 로 바로 이동
  const getBoardWriteUrl = (title: string, author: string, category: string) => {
    const writeTitle = `[${category}] ${title} - ${author} 감상`;
    return `https://queenofboard.vercel.app/board/write?title=${encodeURIComponent(writeTitle)}`;
  };

  return (
    <>
      <section id="creative" className="-mx-4 md:-mx-8 px-4 md:px-8 py-24 bg-[#fcfcfc] border-y border-gray-100 mb-20 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-20 text-slate-900 underline underline-offset-[12px] decoration-gray-300">
            에테르 문학 & 라이프
          </h2>

          <div className="space-y-32">
            {displayPosts.map((post, index) => {
              const title   = cleanTitle(post.title);
              const content = cleanContent(post.content);
              const preview = content.slice(0, 120) + (content.length > 120 ? '...' : '');

              return (
                <article key={index} className="relative">
                  <span className="absolute -top-8 left-0 text-blue-800 font-bold text-[10px] tracking-[0.3em] uppercase font-sans">
                    {post.category} by {post.author_name}
                  </span>
                  <h3 className="text-4xl font-bold mt-2 mb-8 leading-tight text-black">
                    {title}
                  </h3>
                  <p className="text-xl text-slate-800 leading-relaxed italic opacity-95 whitespace-pre-wrap">
                    &ldquo;{preview}&rdquo;
                  </p>

                  {/* 버튼 */}
                  <div className="mt-10 flex flex-wrap gap-3 font-sans">
                    <button
                      onClick={() => setModalPost({ ...post, title, content })}
                      className="px-6 py-2 bg-black text-white text-[11px] font-bold hover:bg-blue-800 transition"
                    >
                      전문 읽기
                    </button>
                    <a
                      href={getBoardWriteUrl(title, post.author_name, post.category)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border border-black text-black text-[11px] font-bold hover:bg-black hover:text-white transition flex items-center gap-1"
                    >
                      💬 감상 남기기
                    </a>
                  </div>
                  <p className="mt-3 text-[10px] text-gray-400 font-sans">
                    감상은 커뮤니티 게시판에 남겨주세요 →{' '}
                    <a href="https://queenofboard.vercel.app/board" target="_blank" rel="noopener noreferrer"
                       className="underline hover:text-black transition-colors">
                      queenofboard
                    </a>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 전문 읽기 모달 */}
      {modalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
             onClick={() => setModalPost(null)}>
          <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-10 relative"
               onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalPost(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-light">
              ✕
            </button>
            <span className="text-blue-800 font-bold text-[10px] tracking-[0.3em] uppercase font-sans">
              {modalPost.category} by {modalPost.author_name}
            </span>
            <h2 className="text-3xl font-bold mt-3 mb-8 leading-tight text-black">
              {modalPost.title}
            </h2>
            <p className="text-lg text-slate-800 leading-relaxed italic whitespace-pre-wrap">
              {modalPost.content || '내용을 불러오는 중입니다.'}
            </p>
            <div className="mt-10 flex gap-3 font-sans">
              <a
                href={getBoardWriteUrl(modalPost.title, modalPost.author_name, modalPost.category)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-black text-white text-[11px] font-bold hover:bg-blue-800 transition"
              >
                💬 감상 남기기
              </a>
              <button onClick={() => setModalPost(null)}
                      className="px-6 py-2 border border-black text-[11px] font-bold hover:bg-black hover:text-white transition">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
