import React from "react";
import VideoCard from "./VideoCard";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  uploadedAt: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
}

interface VideoGridProps {
  videos: Video[];
  onVideoClick?: (video: Video) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  onVideoClick,
  onLoadMore,
  hasMore = true,
}) => {
  return (
    <>
      {/* Videos Grid */}
      <div className="grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onVideoClick={onVideoClick} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Load More Videos
          </button>
        </div>
      )}
    </>
  );
};

export default VideoGrid;
