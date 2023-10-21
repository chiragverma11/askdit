import { INFINITE_SCROLL_COMMENT_RESULTS } from "@/lib/config";
import { db } from "@/lib/db";
import {
  AddCommentValidator,
  AddReplyValidator,
  CommentVoteValidator,
} from "@/lib/validators/comment";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentRouter = router({
  addPostComment: protectedProcedure
    .input(AddCommentValidator)
    .mutation(async (opts) => {
      const { comment, postId } = opts.input;
      const { user } = opts.ctx;

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
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, postId, cursor } = input;

      let hierarchicalReplies = {
        take: INFINITE_SCROLL_COMMENT_RESULTS - 5,
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          replies: {
            take: INFINITE_SCROLL_COMMENT_RESULTS - 6,
            include: {
              author: true,
              votes: true,
              _count: {
                select: {
                  replies: true,
                },
              },
              replies: {
                take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                include: {
                  author: true,
                  votes: true,
                  _count: {
                    select: {
                      replies: true,
                    },
                  },
                  replies: {
                    take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                    include: {
                      author: true,
                      votes: true,
                      _count: {
                        select: {
                          replies: true,
                        },
                      },
                      replies: {
                        take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                        include: {
                          author: true,
                          votes: true,
                          _count: {
                            select: {
                              replies: true,
                            },
                          },
                          replies: {
                            take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                            include: {
                              author: true,
                              votes: true,
                              _count: {
                                select: {
                                  replies: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

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
          replies: hierarchicalReplies,
        },
        where: {
          postId,
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
  getMoreReplies: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        replyToId: z.string(),
        limit: z.number().min(1),
        skip: z.number().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, postId, replyToId } = input;

      let hierarchicalReplies = {
        take: INFINITE_SCROLL_COMMENT_RESULTS - 5,
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
          replies: {
            take: INFINITE_SCROLL_COMMENT_RESULTS - 6,
            include: {
              author: true,
              votes: true,
              _count: {
                select: {
                  replies: true,
                },
              },
              replies: {
                take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                include: {
                  author: true,
                  votes: true,
                  _count: {
                    select: {
                      replies: true,
                    },
                  },
                  replies: {
                    take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                    include: {
                      author: true,
                      votes: true,
                      _count: {
                        select: {
                          replies: true,
                        },
                      },
                      replies: {
                        take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                        include: {
                          author: true,
                          votes: true,
                          _count: {
                            select: {
                              replies: true,
                            },
                          },
                          replies: {
                            take: INFINITE_SCROLL_COMMENT_RESULTS - 7,
                            include: {
                              author: true,
                              votes: true,
                              _count: {
                                select: {
                                  replies: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

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

      const newReply = await db.comment.create({
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
          commentId: newReply.id,
          userId: user.id,
        },
      });

      return {
        commentId: newReply.id,
        message: "Reply added successfully",
      };
    }),
});