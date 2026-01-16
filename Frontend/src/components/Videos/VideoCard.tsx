import React from "react";
import { FaPlay } from "react-icons/fa";

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

interface VideoCardProps {
  video: Video;
  onVideoClick?: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick }) => {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl bg-blue-50 shadow-sm transition-all hover:shadow-lg"
      onClick={() => onVideoClick?.(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Duration Badge */}
        <div className="absolute right-3 bottom-3 rounded-md bg-black/90 px-2 py-1 text-xs font-semibold text-white shadow-lg">
          {video.duration}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
          <div className="hidden rounded-full bg-white/90 p-4 shadow-lg transition-all group-hover:block">
            <FaPlay className="ml-1 h-6 w-6 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="px-2 py-3">
        {/* Author Info */}
        <div className="flex items-start space-x-3">
          <img
            src={video.author.avatar}
            alt={video.author.name}
            className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-300"
          />
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-semibold text-gray-900 group-hover:text-blue-600">
              {video.title}
            </h3>
            <div className="mb-1 flex items-center space-x-1">
              <p className="text-xs font-medium text-gray-700">
                {video.author.name}
              </p>
              {video.author.verified && (
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-[8px] font-bold text-white">✓</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <span className="font-medium">
                {formatViews(video.views)} views
              </span>
              <span className="text-gray-400">•</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
