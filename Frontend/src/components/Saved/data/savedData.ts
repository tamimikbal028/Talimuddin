// Saved Data Types
export interface SavedItem {
  id: string;
  type: "post" | "video" | "article";
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  savedDate: string;
  description: string;
  duration?: string; // For videos
  url?: string; // For articles
}

export interface SavedCategory {
  id: string;
  label: string;
  count: number;
}

// Mock Saved Data
export const mockSavedItems: SavedItem[] = [
  {
    id: "1",
    type: "post",
    title: "Amazing React Tips for Better Performance",
    author: "Sarah Wilson",
    authorAvatar:
      "https://ui-avatars.com/api/?name=Sarah+Wilson&background=3b82f6&color=fff&size=40",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop",
    savedDate: "2 days ago",
    description: "Learn these essential React optimization techniques...",
  },
  {
    id: "2",
    type: "video",
    title: "Modern CSS Grid Layout Tutorial",
    author: "Alex Martinez",
    authorAvatar:
      "https://ui-avatars.com/api/?name=Alex+Martinez&background=10b981&color=fff&size=40",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&h=150&fit=crop",
    savedDate: "1 week ago",
    description: "Complete guide to CSS Grid with practical examples...",
    duration: "15:30",
  },
  {
    id: "3",
    type: "article",
    title: "The Future of Web Development",
    author: "Mike Chen",
    authorAvatar:
      "https://ui-avatars.com/api/?name=Mike+Chen&background=f59e0b&color=fff&size=40",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop",
    savedDate: "3 days ago",
    description: "Exploring upcoming trends and technologies...",
    url: "https://example.com/article",
  },
  {
    id: "4",
    type: "post",
    title: "JavaScript ES2024 Features",
    author: "Emma Davis",
    authorAvatar:
      "https://ui-avatars.com/api/?name=Emma+Davis&background=ef4444&color=fff&size=40",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=150&fit=crop",
    savedDate: "5 days ago",
    description: "New JavaScript features you should know about...",
  },
];

export const mockSavedCategories: SavedCategory[] = [
  { id: "all", label: "All Saved", count: 24 },
  { id: "posts", label: "Posts", count: 12 },
  { id: "videos", label: "Videos", count: 8 },
  { id: "articles", label: "Articles", count: 4 },
];
