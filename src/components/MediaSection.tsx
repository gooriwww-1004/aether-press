// src/components/MediaSection.tsx
// Aether Press · 미디어 센터 - 음악 채널 재생목록 랜덤

interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface MediaSectionProps {
  videos: YouTubeVideo[];
}

export default function MediaSection({ videos }: MediaSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="trending" className="mb-20">
      <h2 className="text-2xl font-black mb-2 border-b-2 border-black pb-2 inline-block tracking-tight">
        MUSIC PICKS
      </h2>
      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-8">
        Curated by Aether Press
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.videoId} className="group flex flex-col gap-3">

            {/* 썸네일 (클릭 시 YouTube 이동) */}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden bg-black"
              style={{ paddingBottom: '56.25%' }}
            >
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
              ) : null}
              {/* 재생 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 ml-1"
                    style={{
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: '18px solid black',
                    }}
                  />
                </div>
              </div>
            </a>

            {/* 영상 정보 */}
            <div className="border-b border-gray-100 pb-4">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {video.channelTitle}
              </p>
              <h3 className="text-sm font-bold leading-snug tracking-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.title}
                </a>
              </h3>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
