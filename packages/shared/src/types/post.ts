export const PostCategory = {
  GENERAL: "GENERAL",
  FOR_SALE: "FOR_SALE",
  TIPS: "TIPS",
  COLLABORATION: "COLLABORATION",
  RECOMMENDATION: "RECOMMENDATION",
} as const;

export type PostCategory = (typeof PostCategory)[keyof typeof PostCategory];

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  category: PostCategory;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithAuthor extends Post {
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}
