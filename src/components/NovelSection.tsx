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

// content 필드 정리: "제목: xxx\n내용: yyy" 형태면 내용만 추출
function cleanContent(raw: string): string {
  if (!raw) return '';
  // "내용:" 이후 텍스트만 추출
  const match = raw.match(/내용[:：]\s*([\s\S]+)/);
  if (match) return match[1].trim();
  // "제목:" 만 있고 내용이 없는 경우 제거
  return raw.replace(/^제목[:：][^\n]*\n?/, '').trim();
}

// title 필드 정리: "제목: xxx" 형태면 xxx만 추출
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
                  <div className="mt-10 flex gap-4 font-sans">
                    <button
                      onClick={() => setModalPost({ ...post, title, content })}
                      className="px-6 py-2 bg-black text-white text-[11px] font-bold hover:bg-blue-800 transition"
                    >
                      전문 읽기
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 모달 */}
      {modalPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setModalPost(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setModalPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-light"
            >
              ✕
            </button>

            {/* 메타 */}
            <span className="text-blue-800 font-bold text-[10px] tracking-[0.3em] uppercase font-sans">
              {modalPost.category} by {modalPost.author_name}
            </span>

            {/* 제목 */}
            <h2 className="text-3xl font-bold mt-3 mb-8 leading-tight text-black">
              {modalPost.title}
            </h2>

            {/* 본문 */}
            <p className="text-lg text-slate-800 leading-relaxed italic whitespace-pre-wrap">
              {modalPost.content || '내용을 불러오는 중입니다.'}
            </p>

            {/* 하단 닫기 */}
            <div className="mt-10 font-sans">
              <button
                onClick={() => setModalPost(null)}
                className="px-6 py-2 border border-black text-[11px] font-bold hover:bg-black hover:text-white transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}