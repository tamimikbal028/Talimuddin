// Types
// export interface Author {
//   id: string;
//   username: string;
//   name: string;
//   avatar: string;
// }

// export interface Post {
//   id: string;
//   author: Author;
//   content: string;
//   images: string[];
//   likes: number;
//   comments: number;
//   shares: number;
//   createdAt: string;
//   isLiked: boolean;
//   isBookmarked: boolean;
// }

export interface NotificationUser {
  name: string;
  username: string;
  avatar: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "share" | "follow" | "mention";
  user: NotificationUser;
  content: string;
  timestamp: string;
  isRead: boolean;
  postContent?: string;
}
/*
// Mock Posts Data
export const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "2",
      username: "sarahw",
      name: "Sarah Wilson",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Wilson&background=3b82f6&color=fff&size=40",
    },
    content:
      "Just launched my new portfolio website! 🚀 Really excited to share my latest projects with everyone. Check it out and let me know what you think!",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
    ],
    likes: 45,
    comments: 12,
    shares: 3,
    createdAt: "2024-01-15T10:30:00Z",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    author: {
      id: "3",
      username: "alexc",
      name: "Alex Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Chen&background=10b981&color=fff&size=40",
    },
    content:
      "Beautiful sunset at the beach today! Nature never fails to amaze me 🌅",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
    ],
    likes: 128,
    comments: 23,
    shares: 8,
    createdAt: "2024-01-15T08:15:00Z",
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "3",
    author: {
      id: "4",
      username: "mikej",
      name: "Mike Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff&size=40",
    },
    content:
      "Working on a new React project using TypeScript and Tailwind CSS. The developer experience is amazing! 💻\n\nAny tips for optimizing performance?",
    images: [],
    likes: 67,
    comments: 15,
    shares: 5,
    createdAt: "2024-01-14T16:45:00Z",
    isLiked: false,
    isBookmarked: false,
  },
];
*/

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Wilson",
      username: "sarahw",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Wilson&background=3b82f6&color=fff&size=40",
    },
    content: "liked your post",
    postContent: "Just launched my new portfolio website! 🚀",
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Alex Chen",
      username: "alexc",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Chen&background=10b981&color=fff&size=40",
    },
    content: 'commented on your post: "Great work! The design looks amazing."',
    postContent: "Just launched my new portfolio website! 🚀",
    timestamp: "15 min ago",
    isRead: false,
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Mike Johnson",
      username: "mikej",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff&size=40",
    },
    content: "started following you",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "share",
    user: {
      name: "Emma Davis",
      username: "emmad",
      avatar:
        "https://ui-avatars.com/api/?name=Emma+Davis&background=ef4444&color=fff&size=40",
    },
    content: "shared your post",
    postContent: "Top 5 React Hooks you should know in 2025",
    timestamp: "3 hours ago",
    isRead: true,
  },
];
