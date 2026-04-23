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

// 개별 상품 슬라이드 카드
function ProductCard({ product }: { product: Product }) {
  const [current, setCurrent] = useState(0);
  const images = product.images?.length > 0 ? product.images : ['/queencoin.jpg'];

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="group border border-gray-100 hover:border-gray-300 transition-all duration-300 bg-white">
      
      {/* 슬라이드 이미지 */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '56.25%' }}>
        <img
          src={images[current]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        {/* 이전/다음 버튼 (이미지 2장 이상일 때만) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white transition-colors flex items-center justify-center text-black font-bold text-sm opacity-0 group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white transition-colors flex items-center justify-center text-black font-bold text-sm opacity-0 group-hover:opacity-100"
            >
              ›
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === current ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* 카테고리 배지 */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-black text-white text-[9px] font-black tracking-widest uppercase">
          {product.category}
        </span>

        {/* 가격 배지 */}
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-white text-black text-[9px] font-black tracking-widest uppercase border border-black">
          {product.price}
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="p-6">
        <h3 className="text-lg font-black tracking-tight mb-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
          {product.description}
        </p>

        {/* 버튼 */}
        <div className="flex gap-3">
          {product.download_url && product.download_url !== '#' && (
            <a
              href={product.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-black text-white text-[11px] font-black tracking-widest uppercase text-center hover:bg-gray-800 transition-colors"
            >
              ↓ 다운로드
            </a>
          )}
          {product.external_url && (
            <a
              href={product.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 border border-black text-black text-[11px] font-black tracking-widest uppercase text-center hover:bg-black hover:text-white transition-colors"
            >
              자세히 보기 →
            </a>
          )}
          {(!product.download_url || product.download_url === '#') && !product.external_url && (
            <span className="flex-1 py-2.5 border border-gray-200 text-gray-300 text-[11px] font-black tracking-widest uppercase text-center">
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

  const activeProducts = products.filter((p) => p);

  return (
    <section id="shop" className="mb-20">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight">SHOP & DOWNLOADS</h2>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
            Queen of Millennium Session
          </p>
        </div>
        <a
          href="https://queenhome.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
        >
          전체 보기 →
        </a>
      </div>

      {/* 상품 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
