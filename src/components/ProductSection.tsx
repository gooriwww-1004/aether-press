'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  download_url: string;
  external_url?: string;
  images: string[];
  category: string;
}

interface ProductSectionProps {
  products: Product[] | null;
}

function ProductCard({ product }: { product: Product }) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const images = product.images?.length > 0 ? product.images : ['/queencoin.jpg'];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  // 설명 미리보기 (3줄)
  const lines = product.description?.split('\n') || [];
  const previewLines = lines.slice(0, 4).join('\n');
  const hasMore = lines.length > 4;

  return (
    <div className="group border border-gray-100 hover:border-gray-300 transition-all duration-300 bg-white flex flex-col">

      {/* 이미지 슬라이드 */}
      <div className="relative overflow-hidden bg-gray-50 flex-shrink-0" style={{ paddingBottom: '62%' }}>
        <img
          key={current}
          src={images[current]}
          alt={`${product.name} ${current + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
          onError={(e) => { (e.target as HTMLImageElement).src = '/queencoin.jpg'; }}
        />

        {/* 이전/다음 */}
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-lg font-bold transition-colors opacity-0 group-hover:opacity-100">
              ‹
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-lg font-bold transition-colors opacity-0 group-hover:opacity-100">
              ›
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                />
              ))}
            </div>

            {/* 카운터 */}
            <span className="absolute top-3 right-3 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              {current + 1} / {images.length}
            </span>
          </>
        )}

        {/* 카테고리 + 가격 */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-black text-white text-[9px] font-black tracking-widest uppercase">
          {product.category}
        </span>
        <span className="absolute bottom-3 right-3 px-3 py-1 bg-white text-black text-[10px] font-black tracking-widest uppercase border border-black">
          {product.price}
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-black tracking-tight mb-3 leading-snug">
          {product.name}
        </h3>

        {/* 설명 (줄바꿈 유지) */}
        <div className="text-gray-600 text-sm font-light leading-relaxed mb-4 flex-1">
          <p className="whitespace-pre-line">
            {expanded ? product.description : previewLines}
          </p>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-dashed border-gray-300 hover:border-black pb-0.5"
            >
              {expanded ? '접기 ↑' : '더 보기 ↓'}
            </button>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-auto">
          {product.download_url && product.download_url !== '#' ? (
            <a
              href={product.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-black text-white text-[11px] font-black tracking-widest uppercase text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              ↓ 다운로드
            </a>
          ) : null}
          {product.external_url ? (
            <a
              href={product.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 border border-black text-black text-[11px] font-black tracking-widest uppercase text-center hover:bg-black hover:text-white transition-colors"
            >
              자세히 →
            </a>
          ) : null}
          {(!product.download_url || product.download_url === '#') && !product.external_url && (
            <span className="flex-1 py-3 border border-gray-200 text-gray-300 text-[11px] font-black tracking-widest uppercase text-center">
              준비 중
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({ products }: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section id="shop" className="mb-20">
      <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight">SHOP & DOWNLOADS</h2>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
            Queen of Millennium Session
          </p>
        </div>
        <a href="https://queenhome.pages.dev/" target="_blank" rel="noopener noreferrer"
           className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
          전체 보기 →
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}