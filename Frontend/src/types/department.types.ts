import type { Pagination } from "./common.types";
import type { Institution } from "./institution.types";
import type { PostResponseItem } from "./post.types";

export interface Department {
  _id: string;
  name: string;
  code: string;
  institution: string | Institution;
  description?: string;
  logo?: string;
  coverImage?: string;
  postsCount: number;
  studentsCount: number;
  followersCount: number;
  isActive: boolean;
  location?: string;
  establishedYear?: number;
  contactEmails?: string[];
  contactPhones?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentsListResponse {
  departments: Department[];
}

export interface DepartmentMeta {
  isFollowing: boolean;
}

export interface DepartmentFeedResponse {
  posts: PostResponseItem[];
  pagination: Pagination;
}
