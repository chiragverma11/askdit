import {
  COMMENT_MAX_REPLIES,
  INFINITE_SCROLL_COMMENT_RESULTS,
} from "@/lib/config";
import { db } from "@/lib/db";
import { updatePostIsAnswered } from "@/lib/prismaQueries";
import {
  createHierarchicalCommentReplyToSelect,
  createHierarchicalRepliesInclude,
  getTopContextParentCommentId,
} from "@/lib/utils";
import {
  AddCommentValidator,
  AddReplyValidator,
  CommentBookmarkValidator,
  CommentDeleteValidator,
  CommentVoteValidator,
} from "@/lib/validators/comment";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentRouter = router({
  addPostComment: protectedProcedure
    .input(AddCommentValidator)
    .mutation(async (opts) => {
      const { comment, postId } = opts.input;
      const { user } = opts.ctx;

      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          id: true,
          isQuestion: true,
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const newComment = await db.comment.create({
        data: {
          text: comment,
          authorId: user.id,
          postId,
        },
      });

      await db.commentVote.create({
        data: {
          type: "UP",
          commentId: newComment.id,
          userId: user.id,
        },
      });

      return {
        commentId: newComment.id,
        message: "Comment added successfully",
      };
    }),
  infiniteComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, postId, userId, cursor } = input;

      const hierarchicalReplies = createHierarchicalRepliesInclude({
        level: 6,
        userId,
        take: COMMENT_MAX_REPLIES,
      });

      const comments = await db.comment.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          bookmarks: {
            where: {
              userId: userId,
            },
          },
          replies: hierarchicalReplies,
        },
        where: {
          postId,
          replyToId: null,
          acceptedAnswer: false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
  getMoreReplies: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string().optional(),
        replyToId: z.string(),
        limit: z.number().min(1),
        skip: z.number().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, postId, userId, replyToId } = input;

      const hierarchicalReplies = createHierarchicalRepliesInclude({
        level: 6,
        userId,
        take: COMMENT_MAX_REPLIES,
      });

      const replies = await db.comment.findMany({
        take: limit,
        skip: skip,
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          bookmarks: {
            where: {
              userId: userId,
            },
          },
          replies: hierarchicalReplies,
        },
        where: {
          postId,
          replyToId,
        },
      });

      return {
        comments: replies,
      };
    }),
  voteComment: protectedProcedure
    .input(CommentVoteValidator)
    .mutation(async (opts) => {
      const { commentId, voteType } = opts.input;
      const { user } = opts.ctx;

      const existingVote = await db.commentVote.findFirst({
        where: {
          userId: user.id,
          commentId,
        },
      });

      const comment = await db.comment.findUnique({
        where: { id: commentId },
        include: { author: true, votes: true },
      });

      if (!comment) {
        return new Response("Comment not found", { status: 404 });
      }

      if (existingVote) {
        if (existingVote.type === voteType) {
          await db.commentVote.delete({
            where: { userId_commentId: { commentId, userId: user.id } },
          });

          return new Response("OK");
        }

        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: user.id,
            },
          },
          data: {
            type: voteType,
          },
        });

        return new Response("OK");
      }

      await db.commentVote.create({
        data: {
          type: voteType,
          userId: user.id,
          commentId,
        },
      });

      return new Response("OK");
    }),
  addReply: protectedProcedure
    .input(AddReplyValidator)
    .mutation(async (opts) => {
      const { comment, postId, replyToId } = opts.input;
      const { user } = opts.ctx;

      const _newReply = await db.comment.create({
        data: {
          text: comment,
          replyToId,
          authorId: user.id,
          postId,
        },
      });

      await db.commentVote.create({
        data: {
          type: "UP",
          commentId: _newReply.id,
          userId: user.id,
        },
      });

      const newReply = await db.comment.findUnique({
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          bookmarks: {
            where: {
              userId: user.id,
            },
          },
          replies: {
            include: {
              author: true,
              votes: true,
              _count: {
                select: {
                  replies: true,
                },
              },
              bookmarks: {
                where: {
                  userId: user.id,
                },
              },
              replies: {
                take: INFINITE_SCROLL_COMMENT_RESULTS,
                include: {
                  author: true,
                  votes: true,
                  _count: {
                    select: {
                      replies: true,
                    },
                  },
                  bookmarks: {
                    where: {
                      userId: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          id: _newReply.id,
        },
      });

      if (!newReply) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return {
        comment: newReply,
        message: "Reply added successfully",
      };
    }),
  delete: protectedProcedure
    .input(CommentDeleteValidator)
    .mutation(async (opts) => {
      const { commentId } = opts.input;
      const { user } = opts.ctx;

      const comment = await db.comment.findUnique({
        where: { id: commentId },
        include: {
          _count: {
            select: {
              replies: true,
            },
          },
        },
      });

      if (!comment) {
        return new Response("Comment not found", { status: 404 });
      }

      if (user.id !== comment.authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      if (comment._count.replies === 0) {
        await db.comment.delete({
          where: {
            id: commentId,
          },
        });
      } else {
        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            deleted: true,
          },
        });
      }

      if (comment.replyToId) {
        const parentComment = await db.comment.findUnique({
          select: {
            id: true,
            deleted: true,
            _count: {
              select: {
                replies: true,
              },
            },
          },
          where: {
            id: comment.replyToId,
          },
        });

        if (parentComment?.deleted && parentComment?._count.replies === 0) {
          await db.comment.delete({
            where: {
              id: parentComment.id,
            },
          });
        }
      } else {
        if (comment.acceptedAnswer) {
          await updatePostIsAnswered(db, commentId, comment.postId);
        }
      }

      return new Response("OK");
    }),
  bookmark: protectedProcedure
    .input(CommentBookmarkValidator)
    .mutation(async (opts) => {
      const { commentId, remove } = opts.input;
      const { user } = opts.ctx;

      if (remove) {
        const bookmark = await db.bookmark.findFirst({
          where: {
            commentId,
            userId: user.id,
          },
        });

        if (!bookmark) {
          return new Response("Bookmark not found", { status: 404 });
        }

        await db.bookmark.delete({
          where: { id: bookmark.id },
        });

        return new Response("Bookmark removed", { status: 200 });
      }

      const comment = await db.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return new Response("Comment not found", { status: 404 });
      }

      await db.bookmark.create({
        data: {
          userId: user.id,
          commentId,
        },
      });

      return new Response("Bookmarked", { status: 200 });
    }),
  infiniteUserComments: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        currentUserId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, authorId, currentUserId, cursor } = input;

      const comments = await db.comment.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
          post: {
            select: {
              subreddit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          authorId,
          deleted: false,
          acceptedAnswer: false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
  getComment: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
        userId: z.string().optional(),
        context: z.number().nonnegative().max(7).default(0),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const { userId, commentId, context } = input;

      let topContextParentCommentId: string | undefined = undefined;
      let repliesContext = context;

      // If context is greator than 0, we need to get the top context parent comment id
      if (context !== 0) {
        const contextParents = await db.comment.findUnique({
          where: {
            id: commentId,
          },
          select: createHierarchicalCommentReplyToSelect({ level: context }),
        });

        const topContext = getTopContextParentCommentId(contextParents);

        topContextParentCommentId = topContext.parentCommentId;
        repliesContext = topContext.findOnContext;
      }

      const hierarchicalReplies = createHierarchicalRepliesInclude({
        level: repliesContext,
        userId,
      });

      const comment = await db.comment.findUnique({
        include: {
          author: true,
          votes: true,
          bookmarks: {
            where: {
              userId: userId,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
          replies: hierarchicalReplies,
        },
        where: {
          id: topContextParentCommentId || commentId,
        },
      });

      return comment;
    }),
  markAnswer: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { commentId } = opts.input;
      const { user } = opts.ctx;

      const comment = await db.comment.findUnique({
        where: { id: commentId },
        select: {
          id: true,
          acceptedAnswer: true,
          post: {
            select: {
              id: true,
              authorId: true,
              isQuestion: true,
            },
          },
        },
      });

      if (!comment) {
        return new Response("Comment not found", { status: 404 });
      }

      if (user.id !== comment.post.authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to perform this action",
        });
      }

      await db.$transaction(async (tx) => {
        await updatePostIsAnswered(tx, commentId, comment.post.id);

        await tx.comment.update({
          where: {
            id: commentId,
          },
          data: {
            acceptedAnswer: !comment.acceptedAnswer,
          },
        });
      });

      return new Response("Answer Marked", { status: 200 });
    }),
  getAcceptedAnswerComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const { userId, postId } = input;

      const hierarchicalReplies = createHierarchicalRepliesInclude({
        level: 6,
        userId,
        take: COMMENT_MAX_REPLIES,
      });

      const comments = await db.comment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          bookmarks: {
            where: {
              userId: userId,
            },
          },
          replies: hierarchicalReplies,
        },
        where: {
          postId,
          replyToId: null,
          acceptedAnswer: true,
        },
      });

      return comments;
    }),
  infiniteUserAnswers: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        currentUserId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, authorId, currentUserId, cursor } = input;

      const comments = await db.comment.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
          post: {
            select: {
              subreddit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          authorId,
          deleted: false,
          post: {
            isQuestion: true,
          },
          replyToId: null,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
});
