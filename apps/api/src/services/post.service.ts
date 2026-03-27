import { prisma } from "../config/database";
import { AppError } from "../middleware/error-handler";
import { CreatePostInput, CreateCommentInput, PostCategory } from "@arc/shared";

export async function createPost(authorId: string, input: CreatePostInput) {
  return prisma.post.create({
    data: { authorId, ...input },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } },
    },
  });
}

export async function getPosts(category?: PostCategory, page = 1, pageSize = 20) {
  const where = category ? { category } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  return { items: posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPostById(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } },
      comments: {
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) throw new AppError(404, "NOT_FOUND", "Post not found");
  return post;
}

export async function createComment(authorId: string, postId: string, input: CreateCommentInput) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, "NOT_FOUND", "Post not found");

  const comment = await prisma.comment.create({
    data: { postId, authorId, body: input.body },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: { commentsCount: { increment: 1 } },
  });

  return comment;
}

export async function deletePost(postId: string, userId: string, isAdmin = false) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, "NOT_FOUND", "Post not found");
  if (post.authorId !== userId && !isAdmin) {
    throw new AppError(403, "FORBIDDEN", "Not authorized to delete this post");
  }

  await prisma.post.delete({ where: { id: postId } });
}
