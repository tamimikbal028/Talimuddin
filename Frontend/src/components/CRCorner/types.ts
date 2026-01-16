export interface Poll {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
  totalVotes: number;
  isEnded?: boolean;
  endedAt?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  url?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  postedBy: string;
  postedById?: string;
  hasFile?: boolean;
  fileName?: string; // deprecated - keeping for backward compatibility
  fileUrl?: string; // deprecated - keeping for backward compatibility
  files?: AttachedFile[]; // new: multiple files support
  readBy?: string[];
}
