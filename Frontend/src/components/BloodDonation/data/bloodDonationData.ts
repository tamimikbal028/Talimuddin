export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  university: string; // BUET, DU, KUET, HSC, etc.
  department: string;
  hall: string;
  gender: "Male" | "Female";
  studentId: string;
  phone: string;
  lastDonation?: string;
  totalDonations: number;
  availability: "Available" | "Not Available" | "Recently Donated";
  avatar: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  unitsNeeded: number;
  hospital: string;
  urgency: "Critical" | "Urgent" | "Normal";
  contactPerson: string;
  contactPhone: string;
  postedBy: string;
  postedDate: string;
  department: string;
  status: "Active" | "Fulfilled" | "Expired";
}

export interface DonationCamp {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  venue: string;
  hall?: string;
  department?: string;
  description: string;
  targetDonors: number;
  registeredDonors: number;
}

// Mock Blood Donors
export const mockBloodDonors: BloodDonor[] = [
  {
    id: "1",
    name: "Rahul Ahmed",
    bloodGroup: "A+",
    university: "BUET",
    department: "CSE",
    hall: "Sher-e-Bangla Hall",
    gender: "Male",
    studentId: "2021-1-60-001",
    phone: "01712345678",
    lastDonation: "2024-08-15",
    totalDonations: 5,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    name: "Tanvir Khan",
    bloodGroup: "O+",
    university: "BUET",
    department: "EEE",
    hall: "Ahsan Ullah Hall",
    gender: "Male",
    studentId: "2021-2-40-005",
    phone: "01812345678",
    lastDonation: "2024-09-20",
    totalDonations: 3,
    availability: "Recently Donated",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "3",
    name: "Sabbir Hossain",
    bloodGroup: "B+",
    university: "BUET",
    department: "ME",
    hall: "Titumir Hall",
    gender: "Male",
    studentId: "2021-3-50-012",
    phone: "01912345678",
    totalDonations: 7,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "4",
    name: "Nasir Uddin",
    bloodGroup: "AB+",
    university: "KUET",
    department: "Civil",
    hall: "Suhrawardy Hall",
    gender: "Male",
    studentId: "2020-4-60-025",
    phone: "01612345678",
    lastDonation: "2024-07-10",
    totalDonations: 4,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=17",
  },
  {
    id: "5",
    name: "Arif Rahman",
    bloodGroup: "O-",
    university: "HSC",
    department: "Science",
    hall: "N/A",
    gender: "Male",
    studentId: "HSC-2023-001",
    phone: "01512345678",
    totalDonations: 2,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: "6",
    name: "Imran Khan",
    bloodGroup: "A-",
    university: "RUET",
    department: "EEE",
    hall: "Ahsan Ullah Hall",
    gender: "Male",
    studentId: "2021-2-40-018",
    phone: "01412345678",
    lastDonation: "2024-06-05",
    totalDonations: 6,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: "7",
    name: "Mehedi Hasan",
    bloodGroup: "B-",
    university: "CUET",
    department: "Architecture",
    hall: "Sher-e-Bangla Hall",
    gender: "Male",
    studentId: "2020-5-30-008",
    phone: "01312345678",
    totalDonations: 1,
    availability: "Not Available",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "8",
    name: "Karim Uddin",
    bloodGroup: "AB-",
    university: "HSC",
    department: "Commerce",
    hall: "N/A",
    gender: "Male",
    studentId: "HSC-2024-015",
    phone: "01212345678",
    lastDonation: "2024-09-01",
    totalDonations: 3,
    availability: "Available",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
];

// Mock Blood Requests
export const mockBloodRequests: BloodRequest[] = [
  {
    id: "1",
    patientName: "Abdul Karim",
    bloodGroup: "A+",
    unitsNeeded: 2,
    hospital: "Dhaka Medical College Hospital",
    urgency: "Critical",
    contactPerson: "Fahim Ahmed",
    contactPhone: "01712345690",
    postedBy: "Fahim Ahmed (CSE, 2nd Year)",
    postedDate: "2 hours ago",
    department: "CSE",
    status: "Active",
  },
  {
    id: "2",
    patientName: "Rabeya Begum",
    bloodGroup: "O+",
    unitsNeeded: 3,
    hospital: "Square Hospital",
    urgency: "Urgent",
    contactPerson: "Sumaiya Islam",
    contactPhone: "01812345691",
    postedBy: "Sumaiya Islam (EEE, 3rd Year)",
    postedDate: "5 hours ago",
    department: "EEE",
    status: "Active",
  },
  {
    id: "3",
    patientName: "Moinul Islam",
    bloodGroup: "B+",
    unitsNeeded: 1,
    hospital: "United Hospital",
    urgency: "Normal",
    contactPerson: "Rakib Hasan",
    contactPhone: "01912345692",
    postedBy: "Rakib Hasan (ME, 4th Year)",
    postedDate: "1 day ago",
    department: "ME",
    status: "Active",
  },
  {
    id: "4",
    patientName: "Fatema Khatun",
    bloodGroup: "AB+",
    unitsNeeded: 2,
    hospital: "BIRDEM Hospital",
    urgency: "Urgent",
    contactPerson: "Nusrat Jahan",
    contactPhone: "01612345693",
    postedBy: "Nusrat Jahan (Civil, 2nd Year)",
    postedDate: "8 hours ago",
    department: "Civil",
    status: "Active",
  },
];

// Mock Donation Camps
export const mockDonationCamps: DonationCamp[] = [
  {
    id: "1",
    title: "CSE Department Blood Donation Camp 2025",
    organizer: "CSE Student Council",
    date: "October 15, 2025",
    time: "9:00 AM - 5:00 PM",
    venue: "ECE Building Auditorium",
    department: "CSE",
    description:
      "Annual blood donation camp organized by CSE department. All students, faculty, and staff are welcome.",
    targetDonors: 100,
    registeredDonors: 67,
  },
  {
    id: "2",
    title: "Sher-e-Bangla Hall Blood Drive",
    organizer: "Hall Provost Office",
    date: "October 20, 2025",
    time: "10:00 AM - 4:00 PM",
    venue: "Sher-e-Bangla Hall Ground Floor",
    hall: "Sher-e-Bangla Hall",
    description:
      "Hall-wide blood donation initiative in collaboration with Red Crescent Society.",
    targetDonors: 80,
    registeredDonors: 45,
  },
  {
    id: "3",
    title: "University Wide Blood Collection",
    organizer: "University Health Center",
    date: "October 25, 2025",
    time: "8:00 AM - 6:00 PM",
    venue: "Central Auditorium",
    description:
      "Major blood donation event for the entire university. Multiple departments participating.",
    targetDonors: 200,
    registeredDonors: 123,
  },
];

// Blood Group Stats
export const bloodGroupStats = {
  "A+": 45,
  "A-": 12,
  "B+": 38,
  "B-": 8,
  "O+": 52,
  "O-": 5,
  "AB+": 15,
  "AB-": 3,
};

// Departments
export const departments = [
  "All Departments",
  "CSE",
  "EEE",
  "ME",
  "Civil",
  "Architecture",
  "CE",
  "IPE",
  "MME",
  "URP",
];

// Halls
export const halls = [
  "All Halls",
  "Sher-e-Bangla Hall",
  "Ahsan Ullah Hall",
  "Titumir Hall",
  "Suhrawardy Hall",
  "Fazlul Huq Hall",
];

// Blood Groups
export const bloodGroups = [
  "All",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];
