// Sidebar Data Types
export interface TrendingTopic {
  hashtag: string;
  posts: string;
  trending: boolean;
}

export interface SuggestedConnection {
  name: string;
  username: string;
  avatar: string;
  mutualConnections: number;
  isVerified: boolean;
}

export interface UpcomingEvent {
  title: string;
  date: string;
  attendees: number;
  image: string;
}

export interface QuickLink {
  name: string;
  icon: React.ComponentType; // For FaIcon components
}

// Mock Sidebar Data
export const mockTrendingTopics: TrendingTopic[] = [
  { hashtag: "ReactJS", posts: "125K posts", trending: true },
  { hashtag: "JavaScript", posts: "89K posts", trending: true },
  { hashtag: "WebDevelopment", posts: "67K posts", trending: false },
  { hashtag: "TypeScript", posts: "45K posts", trending: true },
  { hashtag: "TailwindCSS", posts: "32K posts", trending: false },
  { hashtag: "Frontend", posts: "78K posts", trending: true },
];

export const mockSuggestedConnections: SuggestedConnection[] = [
  {
    name: "Sarah Wilson",
    username: "sarahwilson",
    avatar:
      "https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff&size=40",
    mutualConnections: 8,
    isVerified: true,
  },
  {
    name: "Mike Johnson",
    username: "mikejohnson",
    avatar:
      "https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff&size=40",
    mutualConnections: 12,
    isVerified: false,
  },
  {
    name: "Emma Davis",
    username: "emmadavis",
    avatar:
      "https://ui-avatars.com/api/?name=David+Wilson&background=f59e0b&color=fff&size=40",
    mutualConnections: 5,
    isVerified: true,
  },
];

export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    title: "React Conference 2025",
    date: "Oct 15, 2025",
    attendees: 1247,
    image: "https://picsum.photos/60/60?random=7",
  },
  {
    title: "JavaScript Meetup",
    date: "Oct 20, 2025",
    attendees: 89,
    image: "https://picsum.photos/60/60?random=8",
  },
];

// Note: Quick links will need to import FaIcons in the component
