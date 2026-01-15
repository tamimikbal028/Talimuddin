import type { Pagination } from "./common.types";

export interface CommentAuthor {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
}

export interface Comment {
  _id: string;

  content: string;
  post: string;
  author: CommentAuthor;

  // stats
  likesCount: number;

  // edit status
  isEdited: boolean;
  editedAt?: string;

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentMeta {
  isMine: boolean;
  isLiked: boolean;
}

export interface CommentResponseItem {
  comment: Comment;
  meta: CommentMeta;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: CommentResponseItem[];
    pagination: Pagination;
  };
  message: string;
}

export interface AddCommentResponse {
  success: boolean;
  data: CommentResponseItem;
  message: string;
}

export interface CommentItemProps {
  comment: Comment;
  meta: CommentMeta;
  currentUserId?: string;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
  hideLike?: boolean; // Hide like button for specific contexts (e.g., Room posts)
}
