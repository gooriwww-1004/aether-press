// src/components/AdBanner.tsx
// Aether Press · 광고 배너
// 광고주가 생기기 전: 자사 홍보 슬롯으로 활용
// 광고주 생기면: Supabase posts 테이블에 ad 타입으로 추가

import React from 'react';

interface Ad {
  title:   string;
  summary: string;
  link:    string;
  sponsor: string;
}

// 기본 광고 슬롯 (DB에 광고 없을 때 fallback)
const DEFAULT_ADS: Ad[] = [
  {
    title:   'Millennium Session AI 도구 구독',
    summary: 'Grok · Gemini · Claude · Perplexity — 한 곳에서.',
    link:    '#',
    sponsor: 'Millennium Session',
  },
];

interface AdBannerProps {
  ads?: Ad[] | null;
  variant?: 'horizontal' | 'sidebar';
}

export default function AdBanner({ ads, variant = 'horizontal' }: AdBannerProps) {
  const displayAds = (ads && ads.length > 0) ? ads : DEFAULT_ADS;
  const ad = displayAds[Math.floor(Date.now() / 1000 / 3600) % displayAds.length]; // 시간별 로테이션

  if (variant === 'sidebar') {
    return (
      <aside className="border border-dashed border-gray-200 p-4 bg-[#fafafa]">
        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mb-2">Advertisement</p>
        <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored" className="block group">
          <p className="font-black text-sm leading-tight tracking-tight group-hover:text-blue-700 transition-colors mb-1">
            {ad.title}
          </p>
          <p className="text-[11px] text-gray-500 font-light">{ad.summary}</p>
          <p className="text-[9px] text-gray-300 uppercase tracking-widest mt-2 font-bold">{ad.sponsor}</p>
        </a>
      </aside>
    );
  }

  // 가로 배너 (기사 섹션 사이)
  return (
    <div className="w-full border-y border-dashed border-gray-200 py-3 my-8 bg-[#fafafa]">
      <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto px-4 md:px-8">
        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest flex-shrink-0">Ad</p>
        <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored"
           className="flex items-center gap-4 group flex-1 min-w-0">
          <p className="font-black text-sm tracking-tight group-hover:text-blue-700 transition-colors truncate">
            {ad.title}
          </p>
          <span className="hidden md:block text-[11px] text-gray-400 font-light truncate">{ad.summary}</span>
        </a>
        <span className="text-[9px] text-gray-300 uppercase tracking-widest font-bold flex-shrink-0">
          {ad.sponsor}
        </span>
      </div>
    </div>
  );
}
