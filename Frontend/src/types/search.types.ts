import { GROUP_MEMBERSHIP_STATUS } from "../constants";
import type { Pagination } from "./common.types";
import type { Post } from "./post.types";

export type SearchType =
  | "all"
  | "users"
  | "posts"
  | "groups"
  | "hashtags"
  | "institutions"
  | "departments"
  | "comments";

// Search Result Items

// Search User (Person)
export interface SearchUser {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  userType: string;
  institution?: {
    _id: string;
    name: string;
  };
  academicInfo?: {
    department?: {
      _id: string;
      name: string;
    };
  };
  relationStatus?: "friend" | "request" | "suggestion" | "sent";
}

// Search Group
export interface SearchGroup {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  avatar: string;
  privacy: string;
  type: string;
  membersCount: number;
  postsCount: number;
  userMembership?: (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS];
}

// Search Post - Reusing the core Post type but with flexibility if needed
// For now, we extend or just use Post. The backend returns a shape very similar to Post.
// We explicitly import Post from post.types.ts
export type SearchPost = Post;

// Search Hashtag
export interface SearchHashtag {
  name: string;
  count: number; // Usage count
}

// Search Institution
export interface SearchInstitution {
  _id: string;
  name: string;
  type?: string;
  avatar: string;
}

// Search Department
export interface SearchDepartment {
  _id: string;
  name: string;
  code?: string;
}

// Search Comment
export interface SearchComment {
  _id: string;
  content: string;
  author: {
    fullName: string;
    userName: string;
    avatar: string;
  };
  post?: string;
}

// API Responses
export interface GlobalSearchResponse {
  results: {
    users: SearchUser[];
    posts: SearchPost[];
    groups: SearchGroup[];
    hashtags: SearchHashtag[];
    institutions: SearchInstitution[];
    departments: SearchDepartment[];
    comments: SearchComment[];
  };
  counts: {
    users: number;
    posts: number;
    groups: number;
    hashtags: number;
    institutions: number;
    departments: number;
    comments: number;
  };
  pagination?: Pagination;
  searchTime?: number;
}

export interface SearchSuggestion {
  id: string; // Changed from _id to id
  text: string;
  type: "user" | "group" | "hashtag";
  subtitle?: string; // Changed from subText to subtitle
  avatar?: string; // Changed from image to avatar
  slug?: string; // for groups
  userName?: string; // for users
}
