// Tuition Service Types
export interface TuitionService {
  id: string;
  tutor: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    department: string;
    year: string;
    cgpa: number;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    totalStudents: number;
    experience: string; // e.g., "2 years"
  };
  subjects: string[];
  levels: ("hsc" | "ssc" | "admission" | "university")[];
  pricePerHour: number;
  location: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  teachingMode: ("online" | "offline" | "both")[];
  description: string;
  achievements: string[];
  specialties: string[];
  isAvailable: boolean;
  responseTime: string; // e.g., "Usually responds within 2 hours"
  languages: string[];
  postedDate: string;
  featured: boolean;
}

export interface TuitionRequest {
  id: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    class: string;
    institution: string;
    location: string;
  };
  subject: string;
  level: "hsc" | "ssc" | "admission";
  budget: {
    min: number;
    max: number;
  };
  preferredMode: "online" | "offline" | "both";
  preferredDays: string[];
  preferredTime: string;
  description: string;
  urgency: "low" | "medium" | "high";
  postedDate: string;
  deadline: string;
  isActive: boolean;
}

// Mock Tuition Services Data
export const mockTuitionServices: TuitionService[] = [
  {
    id: "ts1",
    tutor: {
      id: "t1",
      name: "Farhan Ahmed",
      avatar:
        "https://ui-avatars.com/api/?name=Farhan+Ahmed&background=3b82f6&color=fff",
      university: "BUET",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      cgpa: 3.85,
      isVerified: true,
      rating: 4.9,
      reviewCount: 24,
      totalStudents: 45,
      experience: "2 years",
    },
    subjects: ["Mathematics", "Physics", "ICT"],
    levels: ["hsc", "admission"],
    pricePerHour: 500,
    location: "Dhaka University Area",
    availability: {
      days: ["Saturday", "Sunday", "Monday", "Wednesday"],
      timeSlots: [
        "10:00 AM - 12:00 PM",
        "3:00 PM - 5:00 PM",
        "7:00 PM - 9:00 PM",
      ],
    },
    teachingMode: ["online", "offline"],
    description:
      "Experienced tutor specializing in HSC level Mathematics and Physics. Helped 45+ students achieve A+ grades in their HSC exams. Expert in solving complex problems with easy techniques.",
    achievements: [
      "HSC Science - GPA 5.00",
      "University Admission - BUET Rank 67",
      "45+ students taught successfully",
      "95% success rate in HSC exams",
    ],
    specialties: [
      "Problem Solving",
      "Exam Preparation",
      "Weak Student Handling",
    ],
    isAvailable: true,
    responseTime: "Usually responds within 1 hour",
    languages: ["Bengali", "English"],
    postedDate: "2025-09-19",
    featured: true,
  },
  {
    id: "ts2",
    tutor: {
      id: "t2",
      name: "Rashida Sultana",
      avatar:
        "https://ui-avatars.com/api/?name=Rashida+Sultana&background=10b981&color=fff",
      university: "University of Dhaka",
      department: "Chemistry",
      year: "4th Year",
      cgpa: 3.92,
      isVerified: true,
      rating: 4.8,
      reviewCount: 18,
      totalStudents: 32,
      experience: "1.5 years",
    },
    subjects: ["Chemistry", "Biology", "General Science"],
    levels: ["hsc", "ssc"],
    pricePerHour: 450,
    location: "Dhanmondi, Dhaka",
    availability: {
      days: ["Friday", "Saturday", "Sunday", "Tuesday"],
      timeSlots: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"],
    },
    teachingMode: ["offline"],
    description:
      "Chemistry honors student with excellent track record in teaching science subjects. Specializes in making chemistry easy and interesting for HSC and SSC students.",
    achievements: [
      "HSC Science - GPA 5.00",
      "Chemistry Olympiad - Regional Winner",
      "32+ students taught",
      "90% improvement in student grades",
    ],
    specialties: [
      "Organic Chemistry",
      "Lab Techniques",
      "Board Exam Preparation",
    ],
    isAvailable: true,
    responseTime: "Usually responds within 3 hours",
    languages: ["Bengali"],
    postedDate: "2025-09-17",
    featured: false,
  },
  {
    id: "ts3",
    tutor: {
      id: "t3",
      name: "Md. Karim Hassan",
      avatar:
        "https://ui-avatars.com/api/?name=Md+Karim+Hassan&background=f59e0b&color=fff",
      university: "Dhaka University",
      department: "English Literature",
      year: "2nd Year",
      cgpa: 3.75,
      isVerified: true,
      rating: 4.7,
      reviewCount: 15,
      totalStudents: 28,
      experience: "1 year",
    },
    subjects: ["English", "Bangla"],
    levels: ["hsc", "ssc", "admission"],
    pricePerHour: 400,
    location: "Uttara, Dhaka",
    availability: {
      days: ["Friday", "Saturday", "Sunday", "Monday", "Thursday"],
      timeSlots: ["4:00 PM - 6:00 PM", "8:00 PM - 10:00 PM"],
    },
    teachingMode: ["online", "offline"],
    description:
      "English literature student passionate about teaching languages. Experienced in HSC English preparation, creative writing, and university admission English tests.",
    achievements: [
      "HSC Humanities - GPA 5.00",
      "English Olympiad Participant",
      "28+ students guided",
      "IELTS Score: 7.5",
    ],
    specialties: ["Creative Writing", "Grammar", "Literature Analysis"],
    isAvailable: true,
    responseTime: "Usually responds within 2 hours",
    languages: ["Bengali", "English"],
    postedDate: "2025-09-15",
    featured: true,
  },
  {
    id: "ts4",
    tutor: {
      id: "t4",
      name: "Fatema Khatun",
      avatar:
        "https://ui-avatars.com/api/?name=Fatema+Khatun&background=dc2626&color=fff",
      university: "NSU",
      department: "Business Administration",
      year: "3rd Year",
      cgpa: 3.68,
      isVerified: false,
      rating: 4.6,
      reviewCount: 12,
      totalStudents: 20,
      experience: "1 year",
    },
    subjects: ["Accounting", "Business Studies", "Economics"],
    levels: ["hsc", "ssc"],
    pricePerHour: 350,
    location: "Bashundhara, Dhaka",
    availability: {
      days: ["Saturday", "Sunday", "Tuesday", "Wednesday"],
      timeSlots: ["10:00 AM - 12:00 PM", "5:00 PM - 7:00 PM"],
    },
    teachingMode: ["online"],
    description:
      "Business student offering tuition in commerce subjects. Helping HSC and SSC business studies students understand complex concepts with real-world examples.",
    achievements: [
      "HSC Business Studies - GPA 4.83",
      "Commerce Scholarship Recipient",
      "20+ students mentored",
    ],
    specialties: ["Financial Accounting", "Business Math", "Case Studies"],
    isAvailable: true,
    responseTime: "Usually responds within 4 hours",
    languages: ["Bengali", "English"],
    postedDate: "2025-09-13",
    featured: false,
  },
  {
    id: "ts5",
    tutor: {
      id: "t5",
      name: "Ahmed Hasan",
      avatar:
        "https://ui-avatars.com/api/?name=Ahmed+Hasan&background=7c3aed&color=fff",
      university: "IUT",
      department: "Electrical & Electronic Engineering",
      year: "4th Year",
      cgpa: 3.95,
      isVerified: true,
      rating: 4.9,
      reviewCount: 31,
      totalStudents: 52,
      experience: "3 years",
    },
    subjects: ["Mathematics", "Physics", "ICT", "Higher Mathematics"],
    levels: ["hsc", "admission"],
    pricePerHour: 600,
    location: "Gazipur/Online",
    availability: {
      days: ["Friday", "Saturday", "Sunday"],
      timeSlots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
    },
    teachingMode: ["online", "offline"],
    description:
      "Top performing engineering student with 3 years of tutoring experience. Specialized in university admission preparation and advanced mathematics for science students.",
    achievements: [
      "HSC Science - GPA 5.00",
      "IUT Admission - Top 50",
      "52+ students successfully taught",
      "98% success rate in admissions",
    ],
    specialties: [
      "University Admission Prep",
      "Advanced Math",
      "Problem Solving Techniques",
    ],
    isAvailable: true,
    responseTime: "Usually responds within 30 minutes",
    languages: ["Bengali", "English"],
    postedDate: "2025-09-18",
    featured: true,
  },
];

// Mock Tuition Requests Data
export const mockTuitionRequests: TuitionRequest[] = [
  {
    id: "tr1",
    student: {
      id: "s1",
      name: "Sadia Rahman",
      avatar:
        "https://ui-avatars.com/api/?name=Sadia+Rahman&background=ec4899&color=fff",
      class: "HSC 1st Year",
      institution: "Dhaka College",
      location: "New Market, Dhaka",
    },
    subject: "Physics",
    level: "hsc",
    budget: {
      min: 400,
      max: 600,
    },
    preferredMode: "offline",
    preferredDays: ["Friday", "Saturday", "Sunday"],
    preferredTime: "4:00 PM - 6:00 PM",
    description:
      "Need help with HSC Physics, especially mechanics and waves. Looking for someone who can explain concepts clearly and help with problem solving.",
    urgency: "medium",
    postedDate: "2025-09-19",
    deadline: "2025-09-25",
    isActive: true,
  },
  {
    id: "tr2",
    student: {
      id: "s2",
      name: "Rifat Ali",
      avatar:
        "https://ui-avatars.com/api/?name=Rifat+Ali&background=059669&color=fff",
      class: "HSC 2nd Year",
      institution: "Notre Dame College",
      location: "Motijheel, Dhaka",
    },
    subject: "Higher Mathematics",
    level: "hsc",
    budget: {
      min: 500,
      max: 800,
    },
    preferredMode: "both",
    preferredDays: ["Saturday", "Sunday", "Monday"],
    preferredTime: "7:00 PM - 9:00 PM",
    description:
      "HSC 2nd year student struggling with calculus and coordinate geometry. Need intensive preparation for upcoming HSC exams.",
    urgency: "high",
    postedDate: "2025-09-18",
    deadline: "2025-09-22",
    isActive: true,
  },
  {
    id: "tr3",
    student: {
      id: "s3",
      name: "Nusrat Jahan",
      avatar:
        "https://ui-avatars.com/api/?name=Nusrat+Jahan&background=7c2d12&color=fff",
      class: "SSC Candidate",
      institution: "Viqarunnisa Noon School",
      location: "Dhanmondi, Dhaka",
    },
    subject: "Chemistry",
    level: "ssc",
    budget: {
      min: 300,
      max: 450,
    },
    preferredMode: "offline",
    preferredDays: ["Friday", "Saturday"],
    preferredTime: "10:00 AM - 12:00 PM",
    description:
      "SSC candidate needing help with organic chemistry and chemical equations. Want to improve grades before final exams.",
    urgency: "medium",
    postedDate: "2025-09-16",
    deadline: "2025-09-30",
    isActive: true,
  },
];

// Tuition Statistics
export const tuitionStats = {
  totalTutors: 156,
  activeTutors: 89,
  totalRequests: 67,
  successfulMatches: 234,
  averageRating: 4.7,
  averagePrice: 485,
};
