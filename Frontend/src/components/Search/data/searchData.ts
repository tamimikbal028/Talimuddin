// Search Data Types
export interface SearchPerson {
  name: string;
  username: string;
  avatar: string;
}

export interface SearchPost {
  user: string;
  content: string;
  likes: number;
  time: string;
}

export interface SearchHashtag {
  tag: string;
  posts: string;
}

export interface SearchResults {
  people: SearchPerson[];
  posts: SearchPost[];
  hashtags: SearchHashtag[];
}

// Mock Search Data
export const mockSearchResults: SearchResults = {
  people: [
    {
      name: "Alex Johnson",
      username: "@alex_j",
      avatar: "👤",
    },
    {
      name: "Sarah Wilson",
      username: "@sarah_w",
      avatar: "👤",
    },
    {
      name: "Mike Chen",
      username: "@mike_c",
      avatar: "👤",
    },
    {
      name: "Emma Davis",
      username: "@emma_d",
      avatar: "👩‍🎓",
    },
    {
      name: "John Smith",
      username: "@john_smith",
      avatar: "👨‍💼",
    },
    {
      name: "Lisa Park",
      username: "@lisa_park",
      avatar: "👩‍💻",
    },
    {
      name: "David Lee",
      username: "@david_lee",
      avatar: "👨‍🎓",
    },
    {
      name: "Sophia Turner",
      username: "@sophia_t",
      avatar: "👩‍🏫",
    },
    {
      name: "Michael Brown",
      username: "@michael_b",
      avatar: "👨‍💻",
    },
    {
      name: "Olivia Green",
      username: "@olivia_g",
      avatar: "👩‍🎤",
    },
  ],
  posts: [
    {
      user: "Emma Davis",
      content: "Beautiful sunset at the beach 🌅",
      likes: 45,
      time: "2h",
    },
    {
      user: "John Smith",
      content: "Just finished my new project! 🚀",
      likes: 32,
      time: "4h",
    },
    {
      user: "Lisa Park",
      content: "Coffee and coding session ☕💻",
      likes: 28,
      time: "6h",
    },
  ],
  hashtags: [
    { tag: "#photography", posts: "12.3K posts" },
    { tag: "#travel", posts: "8.7K posts" },
    { tag: "#coding", posts: "5.2K posts" },
    { tag: "#food", posts: "4.1K posts" },
  ],
};
