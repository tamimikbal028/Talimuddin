// Student Marketplace Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category:
    | "books"
    | "notes"
    | "supplies"
    | "electronics"
    | "furniture"
    | "clothing"
    | "tuition"
    | "other";
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    university: string;
    department: string;
  };
  location: string;
  postedDate: string;
  tags: string[];
  isAvailable: boolean;
  viewCount: number;
  isFeatured: boolean;
  deliveryOptions: ("pickup" | "delivery" | "shipping")[];
  specifications?: Record<string, string>;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  subcategories: string[];
}

// Mock Marketplace Data
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "mp1",
    title: "Calculus and Analytic Geometry - 9th Edition",
    description:
      "Excellent condition textbook for Calculus I & II. All pages intact, minimal highlighting. Perfect for engineering and math students.",
    price: 1500,
    originalPrice: 3200,
    category: "books",
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u1",
      name: "Ahmed Rahman",
      avatar:
        "https://ui-avatars.com/api/?name=Ahmed+Rahman&background=3b82f6&color=fff",
      rating: 4.8,
      reviewCount: 23,
      isVerified: true,
      university: "University of Dhaka",
      department: "Mathematics",
    },
    location: "Dhaka University Campus",
    postedDate: "2025-09-18",
    tags: ["calculus", "mathematics", "engineering", "textbook"],
    isAvailable: true,
    viewCount: 45,
    isFeatured: true,
    deliveryOptions: ["pickup", "delivery"],
    specifications: {
      Author: "Thomas & Finney",
      Edition: "9th Edition",
      Pages: "1200",
      Language: "English",
      ISBN: "978-0321587992",
    },
  },
  {
    id: "mp2",
    title: "Physics Lab Equipment Set",
    description:
      "Complete physics lab kit including multimeter, oscilloscope, resistors, capacitors, and breadboards. Great for electronics students.",
    price: 4500,
    originalPrice: 8000,
    category: "supplies",
    condition: "like-new",
    images: [
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u2",
      name: "Fatima Khatun",
      avatar:
        "https://ui-avatars.com/api/?name=Fatima+Khatun&background=10b981&color=fff",
      rating: 4.9,
      reviewCount: 31,
      isVerified: true,
      university: "BUET",
      department: "Electrical Engineering",
    },
    location: "BUET Campus",
    postedDate: "2025-09-15",
    tags: ["physics", "lab", "equipment", "electronics"],
    isAvailable: true,
    viewCount: 67,
    isFeatured: false,
    deliveryOptions: ["pickup"],
    specifications: {
      Brand: "Various",
      Condition: "Like New",
      Items: "15+ pieces",
      Warranty: "6 months",
    },
  },
  {
    id: "mp3",
    title: "Comprehensive Computer Science Notes (CSE 1st & 2nd Year)",
    description:
      "Handwritten and typed notes covering Data Structures, Algorithms, OOP, Database, and more. Helped me get A+ grades!",
    price: 800,
    category: "notes",
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u3",
      name: "Md. Karim",
      avatar:
        "https://ui-avatars.com/api/?name=Md+Karim&background=f59e0b&color=fff",
      rating: 4.6,
      reviewCount: 18,
      isVerified: false,
      university: "NSU",
      department: "Computer Science",
    },
    location: "Bashundhara, Dhaka",
    postedDate: "2025-09-12",
    tags: ["computer-science", "notes", "programming", "algorithms"],
    isAvailable: true,
    viewCount: 89,
    isFeatured: true,
    deliveryOptions: ["pickup", "delivery", "shipping"],
    specifications: {
      Pages: "300+",
      Subjects: "8 courses",
      Format: "PDF + Physical",
      Quality: "High",
    },
  },
  {
    id: "mp4",
    title: "MacBook Air M1 (2020) - Perfect for Students",
    description:
      "Lightly used MacBook Air with M1 chip. Excellent battery life, perfect for coding and design work. Includes original charger and box.",
    price: 85000,
    originalPrice: 120000,
    category: "electronics",
    condition: "like-new",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u4",
      name: "Riya Sharma",
      avatar:
        "https://ui-avatars.com/api/?name=Riya+Sharma&background=dc2626&color=fff",
      rating: 5.0,
      reviewCount: 12,
      isVerified: true,
      university: "IUB",
      department: "Computer Science",
    },
    location: "Bashundhara, Dhaka",
    postedDate: "2025-09-10",
    tags: ["macbook", "laptop", "apple", "programming"],
    isAvailable: true,
    viewCount: 156,
    isFeatured: true,
    deliveryOptions: ["pickup", "delivery"],
    specifications: {
      Model: "MacBook Air M1",
      RAM: "8GB",
      Storage: "256GB SSD",
      Year: "2020",
      Battery: "95% health",
    },
  },
  {
    id: "mp5",
    title: "Study Desk with Chair - Wooden",
    description:
      "Comfortable wooden study desk with matching chair. Perfect height for long study sessions. Minor scratches but very functional.",
    price: 3500,
    originalPrice: 6000,
    category: "furniture",
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u5",
      name: "Tanvir Ahmed",
      avatar:
        "https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=8b5cf6&color=fff",
      rating: 4.3,
      reviewCount: 8,
      isVerified: false,
      university: "JU",
      department: "Business",
    },
    location: "Savar, Dhaka",
    postedDate: "2025-09-08",
    tags: ["furniture", "desk", "chair", "study"],
    isAvailable: true,
    viewCount: 34,
    isFeatured: false,
    deliveryOptions: ["pickup"],
    specifications: {
      Material: "Wood",
      Dimensions: "120cm x 60cm",
      Color: "Brown",
      Assembly: "Required",
    },
  },
  {
    id: "mp6",
    title: "Engineering Calculation Set (Calculator + Books)",
    description:
      "Casio fx-991EX calculator with engineering mathematics reference books. Essential for any engineering student.",
    price: 2200,
    originalPrice: 4500,
    category: "supplies",
    condition: "good",
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u6",
      name: "Nasir Uddin",
      avatar:
        "https://ui-avatars.com/api/?name=Nasir+Uddin&background=059669&color=fff",
      rating: 4.7,
      reviewCount: 15,
      isVerified: true,
      university: "KUET",
      department: "Mechanical Engineering",
    },
    location: "Khulna",
    postedDate: "2025-09-05",
    tags: ["calculator", "engineering", "mathematics", "books"],
    isAvailable: true,
    viewCount: 78,
    isFeatured: false,
    deliveryOptions: ["pickup", "shipping"],
    specifications: {
      Calculator: "Casio fx-991EX",
      Books: "3 reference books",
      Condition: "Working perfectly",
      Warranty: "1 year remaining",
    },
  },
  {
    id: "mp7",
    title: "Mathematics Tuition - Calculus & Linear Algebra",
    description:
      "Experienced math tutor offering personalized lessons for Calculus I, II and Linear Algebra. 5+ years experience, helped 100+ students achieve A+ grades.",
    price: 800,
    category: "tuition",
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u7",
      name: "Dr. Rashida Khan",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Rashida+Khan&background=7c3aed&color=fff",
      rating: 4.9,
      reviewCount: 47,
      isVerified: true,
      university: "DU",
      department: "Mathematics",
    },
    location: "Dhanmondi, Dhaka",
    postedDate: "2025-09-19",
    tags: ["mathematics", "calculus", "linear-algebra", "tuition"],
    isAvailable: true,
    viewCount: 134,
    isFeatured: true,
    deliveryOptions: ["pickup"],
    specifications: {
      Experience: "5+ years",
      "Students Taught": "100+",
      "Success Rate": "95%",
      "Session Duration": "1.5 hours",
      Mode: "In-person & Online",
    },
  },
  {
    id: "mp8",
    title: "Programming Tuition - Python, Java, C++",
    description:
      "Software engineer offering programming tutorials for beginners to advanced. Covers Python, Java, C++, Data Structures, and Algorithms.",
    price: 1200,
    category: "tuition",
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u8",
      name: "Md. Fahim Rahman",
      avatar:
        "https://ui-avatars.com/api/?name=Md+Fahim+Rahman&background=dc2626&color=fff",
      rating: 4.8,
      reviewCount: 32,
      isVerified: true,
      university: "BUET",
      department: "Computer Science",
    },
    location: "Uttara, Dhaka",
    postedDate: "2025-09-17",
    tags: ["programming", "python", "java", "cpp", "algorithms"],
    isAvailable: true,
    viewCount: 98,
    isFeatured: false,
    deliveryOptions: ["pickup"],
    specifications: {
      Languages: "Python, Java, C++",
      Topics: "DSA, OOP, Web Dev",
      Experience: "3 years",
      "Project Help": "Available",
      "Batch Size": "Max 4 students",
    },
  },
  {
    id: "mp9",
    title: "Physics Tuition - Classical & Modern Physics",
    description:
      "Physics graduate offering comprehensive physics tuition covering mechanics, thermodynamics, electromagnetism, and quantum physics.",
    price: 1000,
    category: "tuition",
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u9",
      name: "Samira Akter",
      avatar:
        "https://ui-avatars.com/api/?name=Samira+Akter&background=10b981&color=fff",
      rating: 4.7,
      reviewCount: 28,
      isVerified: true,
      university: "DU",
      department: "Physics",
    },
    location: "New Market, Dhaka",
    postedDate: "2025-09-14",
    tags: ["physics", "mechanics", "quantum", "tuition"],
    isAvailable: true,
    viewCount: 76,
    isFeatured: true,
    deliveryOptions: ["pickup"],
    specifications: {
      Subjects: "Classical & Modern Physics",
      Level: "HSC to University",
      Experience: "4 years",
      Materials: "Notes & Problems provided",
      "Lab Help": "Available",
    },
  },
  {
    id: "mp10",
    title: "English Language Tuition - Speaking & Writing",
    description:
      "Native-level English tutor offering conversational English, IELTS preparation, and academic writing classes. Improve your fluency and confidence!",
    price: 600,
    category: "tuition",
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    ],
    seller: {
      id: "u10",
      name: "Sarah Ahmed",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=f59e0b&color=fff",
      rating: 4.9,
      reviewCount: 56,
      isVerified: true,
      university: "NSU",
      department: "English Literature",
    },
    location: "Bashundhara, Dhaka",
    postedDate: "2025-09-16",
    tags: ["english", "ielts", "speaking", "writing"],
    isAvailable: true,
    viewCount: 112,
    isFeatured: false,
    deliveryOptions: ["pickup"],
    specifications: {
      Specializations: "IELTS, Conversation, Writing",
      "Success Rate": "90% IELTS pass",
      "Group Classes": "Available",
      Materials: "Provided",
      "Online Classes": "Available",
    },
  },
];

export const mockMarketplaceCategories: MarketplaceCategory[] = [
  {
    id: "books",
    name: "Books & Textbooks",
    icon: "📚",
    itemCount: 156,
    subcategories: [
      "Engineering",
      "Medical",
      "Business",
      "Literature",
      "Science",
      "Mathematics",
    ],
  },
  {
    id: "notes",
    name: "Study Notes",
    icon: "📝",
    itemCount: 89,
    subcategories: [
      "Handwritten",
      "Typed",
      "Summary",
      "Past Papers",
      "Lab Reports",
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "💻",
    itemCount: 45,
    subcategories: [
      "Laptops",
      "Tablets",
      "Phones",
      "Calculators",
      "Accessories",
    ],
  },
  {
    id: "supplies",
    name: "Study Supplies",
    icon: "✏️",
    itemCount: 78,
    subcategories: [
      "Stationery",
      "Lab Equipment",
      "Art Supplies",
      "Tools",
      "Software",
    ],
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "🪑",
    itemCount: 34,
    subcategories: ["Desks", "Chairs", "Bookshelves", "Storage", "Lighting"],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: "👕",
    itemCount: 67,
    subcategories: ["Uniforms", "Casual", "Formal", "Sports", "Accessories"],
  },
  {
    id: "tuition",
    name: "Tuition & Coaching",
    icon: "👨‍🏫",
    itemCount: 92,
    subcategories: [
      "Math",
      "Physics",
      "Chemistry",
      "English",
      "Programming",
      "Language",
    ],
  },
];

// Marketplace Statistics
export const marketplaceStats = {
  totalItems: 561,
  activeUsers: 1234,
  totalTransactions: 567,
  averageRating: 4.6,
  categoriesCount: 7,
  featuredItems: 15,
};
