import {
  POST_TYPES,
  POST_TARGET_MODELS,
  POST_VISIBILITY,
  POST_STATUS,
} from "../constants/post";
import type { Pagination } from "./common.types";

export interface Attachment {
  type: "IMAGE" | "VIDEO" | "PDF" | "DOC" | "LINK";
  url: string;
  name?: string;
}

// Post Details Type
export interface Post {
  _id: string;
  content: string;
  attachments: Attachment[];

  type: (typeof POST_TYPES)[keyof typeof POST_TYPES];
  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  postOnId: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  status?: (typeof POST_STATUS)[keyof typeof POST_STATUS];

  author: {
    _id: string;
    fullName: string;
    avatar: string;
    userName: string;
  };

  // Stats
  likesCount: number;
  commentsCount: number;
  sharesCount: number;

  createdAt: string;
  updatedAt: string;

  // Edit status
  isEdited: boolean;
  editedAt?: string;

  // Flags
  isArchived: boolean;
  isPinned: boolean;
  isDeleted: boolean;

  // Optional fields
  tags?: string[];
}

export interface PostMeta {
  isLiked: boolean;
  isSaved: boolean;
  isMine: boolean;
  isRead: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
  canDelete?: boolean;
}

export interface PostResponseItem {
  post: Post;
  meta: PostMeta;
}

export interface FeedResponse {
  statusCode: number;
  data: {
    posts: PostResponseItem[];
    pagination: Pagination;
  };
  message: string;
  success: boolean;
}

export interface ProfilePostsResponse {
  statusCode: number;
  data: {
    posts: PostResponseItem[];
    pagination: Pagination;
  };
  message: string;
  success: boolean;
}

export interface ProfilePostsProps {
  username: string;
  isOwnProfile: boolean;
}

export interface CreatePostRequest {
  content: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  postOnId: string;
  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  type: (typeof POST_TYPES)[keyof typeof POST_TYPES];
  attachments: Attachment[];
  pollOptions: string[];
  tags: string[];
}

export interface PostContentProps {
  content: string;
  tags?: string[];
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  isEditing: boolean;
  isUpdating: boolean;
  onUpdate: (data: {
    content: string;
    tags: string[];
    visibility: string;
  }) => void;
  onCancel: () => void;
  allowedVisibilities: string[];
}
