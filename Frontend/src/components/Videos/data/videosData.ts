export interface Video {
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

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "React 19 New Features Explained",
    thumbnail: "https://picsum.photos/400/225?random=1",
    duration: "15:32",
    views: 125000,
    likes: 8500,
    comments: 245,
    uploadedAt: "2 days ago",
    author: {
      name: "Tech Academy",
      username: "techacademy",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff&size=40",
      verified: true,
    },
    category: "Technology",
  },
  {
    id: "2",
    title: "Building Modern Web Apps with TypeScript",
    thumbnail: "https://picsum.photos/400/225?random=2",
    duration: "28:45",
    views: 89000,
    likes: 6200,
    comments: 189,
    uploadedAt: "5 days ago",
    author: {
      name: "CodeMaster",
      username: "codemaster",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff&size=40",
      verified: true,
    },
    category: "Programming",
  },
  {
    id: "3",
    title: "AI and Machine Learning in 2025",
    thumbnail: "https://picsum.photos/400/225?random=3",
    duration: "22:18",
    views: 203000,
    likes: 12800,
    comments: 456,
    uploadedAt: "1 week ago",
    author: {
      name: "AI Insights",
      username: "aiinsights",
      avatar:
        "https://ui-avatars.com/api/?name=David+Wilson&background=f59e0b&color=fff&size=40",
      verified: true,
    },
    category: "AI & ML",
  },
  {
    id: "4",
    title: "Web Design Trends That Will Dominate",
    thumbnail: "https://picsum.photos/400/225?random=4",
    duration: "18:55",
    views: 76000,
    likes: 4300,
    comments: 127,
    uploadedAt: "3 days ago",
    author: {
      name: "Design Pro",
      username: "designpro",
      avatar:
        "https://ui-avatars.com/api/?name=Tom+Brown&background=8b5cf6&color=fff&size=40",
      verified: false,
    },
    category: "Design",
  },
  {
    id: "5",
    title: "Full Stack Development Roadmap",
    thumbnail: "https://picsum.photos/400/225?random=5",
    duration: "35:12",
    views: 156000,
    likes: 9800,
    comments: 334,
    uploadedAt: "2 weeks ago",
    author: {
      name: "Dev Journey",
      username: "devjourney",
      avatar:
        "https://ui-avatars.com/api/?name=Ryan+Davis&background=ef4444&color=fff&size=40",
      verified: true,
    },
    category: "Career",
  },
  {
    id: "6",
    title: "CSS Grid vs Flexbox: When to Use What",
    thumbnail: "https://picsum.photos/400/225?random=6",
    duration: "12:43",
    views: 98000,
    likes: 5600,
    comments: 198,
    uploadedAt: "4 days ago",
    author: {
      name: "CSS Wizard",
      username: "csswizard",
      avatar:
        "https://ui-avatars.com/api/?name=James+Miller&background=06b6d4&color=fff&size=40",
      verified: false,
    },
    category: "CSS",
  },
];

export const videoCategories = [
  "All",
  "Technology",
  "Programming",
  "AI & ML",
  "Design",
  "Career",
  "CSS",
];
