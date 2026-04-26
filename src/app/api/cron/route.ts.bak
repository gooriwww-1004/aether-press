import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchRSSFeeds } from '@/lib/rss';
import { generateNovel, generateLifestyle, summarizeNews, getTodayThemes } from '@/lib/agents';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = { date: today, news: 0, creative: 0, skipped: 0, errors: [] as string[] };

  try {
    const rssItems = await fetchRSSFeeds();
    for (const item of rssItems) {
      try {
        const { data: existing } = await supabaseAdmin
          .from('posts').select('id').eq('external_url', item.link).maybeSingle();
        if (existing) { results.skipped++; continue; }

        const { title, summary } = await summarizeNews(item.title, item.description, item.source);
        const { error } = await supabaseAdmin.from('posts').insert({
          content_type: 'external_link',
          title,
          summary,
          source_name: item.source,
          external_url: item.link,
          published_date: today,
        });
        if (error) {
          if (error.code === '23505') { results.skipped++; continue; }
          throw error;
        }
        results.news++;
        await new Promise(r => setTimeout(r, 200));
      } catch (err: any) {
        results.errors.push(`RSS[${item.source}]: ${err.message}`);
      }
    }
  } catch (err: any) {
    results.errors.push(`RSS failed: ${err.message}`);
  }

  try {
    const { sf: sfTheme, life: lifeTheme } = getTodayThemes();
    const novel = await generateNovel(sfTheme);
    await supabaseAdmin.from('posts').insert({ ...novel, published_date: today });
    results.creative++;
    await new Promise(r => setTimeout(r, 300));
    const lifestyle = await generateLifestyle(lifeTheme);
    await supabaseAdmin.from('posts').insert({ ...lifestyle, published_date: today });
    results.creative++;
  } catch (err: any) {
    results.errors.push(`AI failed: ${err.message}`);
  }

  return NextResponse.json({ success: true, ...results });
}

export async function POST(req: NextRequest) {
  return GET(req);
}