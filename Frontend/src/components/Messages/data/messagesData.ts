export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  type: "direct" | "group" | "university" | "global"; // Message type
  category?: string; // For university groups: "departmental" | "section" | "hall"
  subCategory?: string; // For sections: "A", "B", "C" or "A1", "A2"
}

export interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

// Direct Messages (Person to Person)
export const directMessages: Conversation[] = [
  {
    id: "dm-1",
    name: "Rahul Ahmed",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Assignment submit korlam!",
    time: "2m",
    unread: 2,
    online: true,
    type: "direct",
  },
  {
    id: "dm-2",
    name: "Tanvir Khan",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Class kobe hobe?",
    time: "15m",
    online: true,
    type: "direct",
  },
  {
    id: "dm-3",
    name: "Sabbir Hossain",
    avatar: "https://i.pravatar.cc/150?img=33",
    lastMessage: "Thanks for your help!",
    time: "1h",
    type: "direct",
  },
  {
    id: "dm-4",
    name: "Nasir Uddin",
    avatar: "https://i.pravatar.cc/150?img=17",
    lastMessage: "Notes ta share korba?",
    time: "3h",
    type: "direct",
  },
  {
    id: "dm-5",
    name: "Farhan Islam",
    avatar: "https://i.pravatar.cc/150?img=15",
    lastMessage: "Okay, see you tomorrow",
    time: "1d",
    online: true,
    type: "direct",
  },
];

// Group Chats (User Created Groups)
export const groupChats: Conversation[] = [
  {
    id: "gc-1",
    name: "Study Squad",
    avatar: "https://i.pravatar.cc/150?img=50",
    lastMessage: "Mehedi: Tomorrow's quiz er preparation?",
    time: "5m",
    unread: 5,
    type: "group",
  },
  {
    id: "gc-2",
    name: "Project Team A",
    avatar: "https://i.pravatar.cc/150?img=51",
    lastMessage: "Arif: Meeting at 3 PM",
    time: "30m",
    unread: 2,
    type: "group",
  },
  {
    id: "gc-3",
    name: "Weekend Gamers",
    avatar: "https://i.pravatar.cc/150?img=52",
    lastMessage: "Karim: Anyone free tonight?",
    time: "2h",
    type: "group",
  },
  {
    id: "gc-4",
    name: "Math Lovers",
    avatar: "https://i.pravatar.cc/150?img=53",
    lastMessage: "Shakil: Check this problem",
    time: "5h",
    unread: 1,
    type: "group",
  },
];

// University Groups
export const universityGroups: Conversation[] = [
  // Departmental Groups
  {
    id: "ug-dept-1",
    name: "CSE Department",
    avatar: "https://i.pravatar.cc/150?img=60",
    lastMessage: "Dr. Rahman: Seminar tomorrow at 10 AM",
    time: "10m",
    unread: 3,
    type: "university",
    category: "departmental",
  },
  {
    id: "ug-dept-2",
    name: "EEE Department",
    avatar: "https://i.pravatar.cc/150?img=61",
    lastMessage: "Lab schedule updated",
    time: "1h",
    type: "university",
    category: "departmental",
  },

  // Section Groups
  {
    id: "ug-sec-a",
    name: "CSE Section A",
    avatar: "https://i.pravatar.cc/150?img=62",
    lastMessage: "CR: Class postponed to 2 PM",
    time: "20m",
    unread: 7,
    type: "university",
    category: "section",
    subCategory: "A",
  },
  {
    id: "ug-sec-b",
    name: "CSE Section B",
    avatar: "https://i.pravatar.cc/150?img=63",
    lastMessage: "Assignment deadline extended",
    time: "45m",
    unread: 4,
    type: "university",
    category: "section",
    subCategory: "B",
  },
  {
    id: "ug-sec-c",
    name: "CSE Section C",
    avatar: "https://i.pravatar.cc/150?img=64",
    lastMessage: "Quiz on Friday confirmed",
    time: "2h",
    type: "university",
    category: "section",
    subCategory: "C",
  },

  // Sub-section Groups
  {
    id: "ug-subsec-a1",
    name: "CSE Section A1",
    avatar: "https://i.pravatar.cc/150?img=65",
    lastMessage: "Group project discussion",
    time: "1h",
    unread: 2,
    type: "university",
    category: "section",
    subCategory: "A1",
  },
  {
    id: "ug-subsec-a2",
    name: "CSE Section A2",
    avatar: "https://i.pravatar.cc/150?img=66",
    lastMessage: "Lab report submission reminder",
    time: "3h",
    type: "university",
    category: "section",
    subCategory: "A2",
  },

  // Hall Groups
  {
    id: "ug-hall-1",
    name: "Shaheed Salam Hall",
    avatar: "https://i.pravatar.cc/150?img=67",
    lastMessage: "Provost: Hall meeting on Sunday",
    time: "4h",
    unread: 10,
    type: "university",
    category: "hall",
  },
  {
    id: "ug-hall-2",
    name: "Fazlul Haque Hall",
    avatar: "https://i.pravatar.cc/150?img=68",
    lastMessage: "Sports tournament registration open",
    time: "6h",
    unread: 5,
    type: "university",
    category: "hall",
  },
  {
    id: "ug-hall-3",
    name: "Rokeya Hall",
    avatar: "https://i.pravatar.cc/150?img=69",
    lastMessage: "Cultural program next week",
    time: "1d",
    type: "university",
    category: "hall",
  },
];

// Global Chats
export const globalChats: Conversation[] = [
  {
    id: "global-1",
    name: "Bangladesh Students",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Shakib: Anyone going to the book fair?",
    time: "5m",
    unread: 15,
    type: "global",
  },
  {
    id: "global-2",
    name: "Tech Enthusiasts BD",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Rafiq: New programming contest announced",
    time: "20m",
    unread: 8,
    type: "global",
  },
  {
    id: "global-3",
    name: "University Sports",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Kamal: Inter-university football tournament registration",
    time: "1h",
    type: "global",
  },
  {
    id: "global-4",
    name: "Career Development",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Nadia: Google internship opportunities",
    time: "2h",
    unread: 12,
    type: "global",
  },
  {
    id: "global-5",
    name: "Academic Help",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Imran: Need help with calculus problem",
    time: "3h",
    unread: 5,
    type: "global",
  },
];

// All conversations combined
export const mockConversations: Conversation[] = [
  ...directMessages,
  ...groupChats,
  ...universityGroups,
  ...globalChats,
];

export const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey! Assignment er deadline kobe?",
    sender: "other",
    time: "10:30 AM",
  },
  {
    id: "2",
    text: "Friday, 5 PM porjonto",
    sender: "me",
    time: "10:32 AM",
  },
  {
    id: "3",
    text: "Okay thanks! Tumi submit korso?",
    sender: "other",
    time: "10:33 AM",
  },
  {
    id: "4",
    text: "Hae, ajke submit korlam",
    sender: "me",
    time: "10:35 AM",
  },
  {
    id: "5",
    text: "Assignment submit korlam!",
    sender: "other",
    time: "10:45 AM",
  },
];
