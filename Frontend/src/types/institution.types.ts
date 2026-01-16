import type { Pagination } from "./common.types";
import type { PostResponseItem } from "./post.types";
import { INSTITUTION_TYPES, INSTITUTION_CATEGORY } from "../constants";

export interface Institution {
  _id: string;
  name: string;
  code: string;
  type: (typeof INSTITUTION_TYPES)[keyof typeof INSTITUTION_TYPES];
  category: (typeof INSTITUTION_CATEGORY)[keyof typeof INSTITUTION_CATEGORY];
  location: string;
  website?: string;
  logo: string;
  coverImage?: string;
  postsCount: number;
  followersCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionMeta {
  isFollowing: boolean;
}

export interface InstitutionHeaderResponse {
  institution: Institution;
  meta: InstitutionMeta;
}

export interface InstitutionDetailsResponse {
  institution: Institution;
}

export interface InstitutionFeedResponse {
  posts: PostResponseItem[];
  pagination: Pagination;
}
