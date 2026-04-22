// src/app/api/cron/route.ts
// Aether Press · 자동화 엔진
// Vercel Cron이 매일 오전 6시(KST = UTC 21시)에 이 엔드포인트를 호출합니다
// vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "0 21 * * *" }] }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchRSSFeeds } from '@/lib/rss';
import { generateNovel, generateLifestyle, summarizeNews, getTodayThemes } from '@/lib/agents';

// Service Role 클라이언트 (RLS 우회 · 서버에서만 사용)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← Supabase Dashboard > Settings > API 에서 복사
);

export const dynamic  = 'force-dynamic';
export const maxDuration = 60; // Vercel Hobby 최대 60초

// -------------------------------------------------------
// GET /api/cron
// -------------------------------------------------------
export async function GET(req: NextRequest) {
  // ① Vercel Cron 인증 헤더 검증
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today   = new Date().toISOString().split('T')[0];
  const results = {
    date:    today,
    news:    0,
    creative: 0,
    skipped: 0,
    errors:  [] as string[],
  };

  // -------------------------------------------------------
  // STEP 1: RSS 뉴스 수집 → AI 요약 → DB 저장
  // -------------------------------------------------------
  try {
    const rssItems = await fetchRSSFeeds();
    console.log(`[Cron] RSS items fetched: ${rssItems.length}`);

    for (const item of rssItems) {
      try {
        // 중복 URL 체크
        const { data: existing } = await supabaseAdmin
          .from('posts')
          .select('id')
          .eq('external_url', item.link)
          .maybeSingle();

        if (existing) {
          results.skipped++;
          continue;
        }

        // AI 요약
        const { title, summary } = await summarizeNews(
          item.title,
          item.description,
          item.source
        );

        // DB 저장
        const { error } = await supabaseAdmin.from('posts').insert({
          content_type:   'external_link',
          title,
          summary,
          source_name:    item.source,
          external_url:   item.link,
          published_date: today,
        });

        if (error) {
          // UNIQUE 제약 위반은 조용히 skip
          if (error.code === '23505') { results.skipped++; continue; }
          throw error;
        }

        results.news++;

        // API 할당량 보호: 요청 사이 200ms 대기
        await sleep(200);
      } catch (err: any) {
        results.errors.push(`RSS[${item.source}]: ${err.message}`);
      }
    }
  } catch (err: any) {
    results.errors.push(`RSS 전체 실패: ${err.message}`);
  }

  // -------------------------------------------------------
  // STEP 2: AI 창작 콘텐츠 생성
  // -------------------------------------------------------
  try {
    const { sf: sfTheme, life: lifeTheme } = getTodayThemes();

    // 백서아: SF 소설
    const novel = await generateNovel(sfTheme);
    await supabaseAdmin.from('posts').insert({ ...novel, published_date: today });
    results.creative++;

    await sleep(300);

    // 강서진: 라이프 팁
    const lifestyle = await generateLifestyle(lifeTheme);
    await supabaseAdmin.from('posts').insert({ ...lifestyle, published_date: today });
    results.creative++;

  } catch (err: any) {
    results.errors.push(`AI 창작 실패: ${err.message}`);
  }

  // -------------------------------------------------------
  // STEP 3: 오래된 데이터 정리 (30일 초과 외부링크 삭제)
  // -------------------------------------------------------
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    await supabaseAdmin
      .from('posts')
      .delete()
      .eq('content_type', 'external_link')
      .lt('created_at', cutoff.toISOString());
  } catch (err: any) {
    // 정리 실패는 치명적이지 않음
    console.warn('[Cron] Cleanup failed:', err.message);
  }

  console.log('[Cron] Done:', results);
  return NextResponse.json({ success: true, ...results });
}

// 수동 트리거도 지원 (POST)
export async function POST(req: NextRequest) {
  return GET(req);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
