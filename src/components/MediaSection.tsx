// src/components/MediaSection.tsx
// Aether Press · 미디어 센터
// YouTube 트렌딩 영상 임베드 + TikTok 링크 카드

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
      <h2 className="text-2xl font-black mb-8 border-b-2 border-black pb-2 inline-block tracking-tight">
        MEDIA CENTER
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {videos.slice(0, 3).map((video) => (
          <div key={video.videoId} className="group">
            {/* YouTube 임베드 */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {/* 영상 정보 */}
            <div className="mt-3 border-b border-gray-100 pb-4">
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
