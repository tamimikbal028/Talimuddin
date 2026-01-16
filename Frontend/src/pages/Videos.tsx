import React, { useState } from "react";
import VideosHeader from "../components/Videos/VideosHeader";
import VideoCategories from "../components/Videos/VideoCategories";
import VideoGrid from "../components/Videos/VideoGrid";
import {
  mockVideos,
  videoCategories,
  type Video,
} from "../components/Videos/data/videosData";

const Videos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const videos: Video[] = mockVideos;

  const categories = videoCategories;

  const handleVideoClick = (video: Video) => {
    console.log("Video clicked:", video.title);
    // Handle video click logic here
  };

  const handleLoadMore = () => {
    console.log("Load more videos");
    // Handle load more logic here
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Handle category filtering logic here
  };

  return (
    <>
      <VideosHeader />
      <VideoCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <VideoGrid
        videos={videos}
        onVideoClick={handleVideoClick}
        onLoadMore={handleLoadMore}
        hasMore={true}
      />
    </>
  );
};

export default Videos;
