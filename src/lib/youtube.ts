// src/lib/youtube.ts
// 재생목록 3개에서 각각 랜덤 영상 1개씩 가져오기

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  playlistId: string;
}

const PLAYLISTS = [
  'PLkqWRj5Y_xwkMKfPdKk7oiYg8GQiAH00Y',
  'PLkqWRj5Y_xwlkgEXTRgFcIQKg3uwJK0u8',
  'PLkqWRj5Y_xwm6UI9HAwNB4sNzISug-r-G',
];

// 재생목록에서 최대 50개 가져온 뒤 랜덤 1개 선택
async function fetchRandomFromPlaylist(
  playlistId: string,
  apiKey: string
): Promise<YouTubeVideo | null> {
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[YouTube] playlist ${playlistId} error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const items = (data.items ?? []).filter(
      (item: any) => item.snippet?.resourceId?.videoId
    );

    if (items.length === 0) return null;

    // 랜덤 선택
    const random = items[Math.floor(Math.random() * items.length)];
    const snippet = random.snippet;
    const videoId = snippet.resourceId.videoId;

    return {
      videoId,
      title:        snippet.title,
      channelTitle: snippet.channelTitle || snippet.videoOwnerChannelTitle || '',
      thumbnailUrl: snippet.thumbnails?.maxres?.url ||
                    snippet.thumbnails?.high?.url ||
                    snippet.thumbnails?.medium?.url || '',
      playlistId,
    };
  } catch (err) {
    console.error(`[YouTube] playlist ${playlistId} failed:`, err);
    return null;
  }
}

export async function fetchPlaylistVideos(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('[YouTube] API key not found');
    return [];
  }

  // 3개 재생목록 병렬 호출
  const results = await Promise.all(
    PLAYLISTS.map((id) => fetchRandomFromPlaylist(id, apiKey))
  );

  return results.filter((v): v is YouTubeVideo => v !== null);
}
