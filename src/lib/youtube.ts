// src/lib/youtube.ts
// YouTube Data API v3 - 트렌딩 영상 수집

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export async function fetchTrendingVideos(
  maxResults = 3,
  regionCode = 'KR',
  categoryId = '28' // 28 = Science & Technology
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('[YouTube] API key not found');
    return [];
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('chart', 'mostPopular');
    url.searchParams.set('regionCode', regionCode);
    url.searchParams.set('videoCategoryId', categoryId);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) {
      console.error('[YouTube] API error:', res.status);
      return [];
    }

    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      videoId:      item.id,
      title:        item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.high?.url ||
                    item.snippet.thumbnails?.medium?.url || '',
    }));
  } catch (err) {
    console.error('[YouTube] fetch failed:', err);
    return [];
  }
}
