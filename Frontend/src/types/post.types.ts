import { POST_TARGET_MODELS, POST_VISIBILITY } from "../constants/post";
import type { Pagination } from "./common.types";

export interface Attachment {
  url: string;
  name?: string;
  size?: number;
}

// Post Details Type
export interface Post {
  _id: string;
  title?: string;
  content: string;
  attachments: Attachment[];

  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  postOnId: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];

  author: {
    _id: string;
    fullName: string;
    avatar: string;
    userName: string;
  };

  createdAt: string;
  updatedAt: string;

  // Edit status
  isEdited: boolean;
  editedAt?: string;

  // Flags
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
}

export interface CreatePostRequest {
  title?: string;
  content: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  postOnId: string;
  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  attachments: Attachment[];
  tags: string[];
}

export interface PostContentProps {
  title?: string;
  content: string;
  tags?: string[];
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  isEditing: boolean;
  isUpdating: boolean;
  onUpdate: (data: {
    title?: string;
    content: string;
    tags: string[];
    visibility: string;
  }) => void;
  onCancel: () => void;
  allowedVisibilities: string[];
}
