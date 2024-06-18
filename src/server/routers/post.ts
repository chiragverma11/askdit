import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { db } from "@/lib/db";
import { ImageKitImageBulkDeleter } from "@/lib/imagekit/imagesDeleter";
import {
  getRelativeUrl,
  getUrlMetadata,
  isImageAccessible,
  isValidUrl,
} from "@/lib/utils";
import {
  MediaPostValidator,
  PostBookmarkValidator,
  PostDeleteValidator,
  PostValidator,
  PostVoteValidator,
} from "@/lib/validators/post";
import { EditorJSContent } from "@/types/utilities";
import { VoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  createCommunityPost: protectedProcedure
    .input(PostValidator)
    .mutation(async (opts) => {
      const { communityId, title, content, type, storageUsed, isQuestion } =
        opts.input;
      const { user } = opts.ctx;

      const community = await db.subreddit.findFirst({
        where: {
          id: communityId,
        },
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community doesn't exist.",
        });
      }

      const post = await db.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: {
            title: title,
            content: content,
            subredditId: communityId,
            type: type,
            authorId: user.id,
            storageUsed: storageUsed,
            isQuestion: isQuestion,
          },
        });

        if (storageUsed > 0) {
          await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              storageUsed: {
                increment: storageUsed,
              },
            },
          });
        }

        return post;
      });
      return { postId: post.id, message: "Post created successfully" };
    }),
  votePost: protectedProcedure
    .input(PostVoteValidator)
    .mutation(async (opts) => {
      const { postId, voteType } = opts.input;
      const { user } = opts.ctx;

      const existingVote = await db.vote.findFirst({
        where: {
          userId: user.id,
          postId,
        },
      });

      const post = await db.post.findUnique({
        where: { id: postId },
        include: { author: true, votes: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingVote) {
        if (existingVote.type === voteType) {
          await db.vote.delete({
            where: { userId_postId: { postId, userId: user.id } },
          });

          // const votesAmt = post.votes.reduce((acc, vote) => {
          //   if (vote.type === "UP") return acc + 1;
          //   if (vote.type === "DOWN") return acc - 1;
          //   return acc;
          // }, 0);

          return {
            success: true,
            message: `Post ${voteType === "UP" ? "upvoted" : "downvoted"} successfully`,
          };
        }

        await db.vote.update({
          where: {
            userId_postId: {
              postId,
              userId: user.id,
            },
          },
          data: {
            type: voteType,
          },
        });

        return {
          success: true,
          message: `Post ${voteType === "UP" ? "upvoted" : "downvoted"} successfully`,
        };
      }

      await db.vote.create({
        data: {
          type: voteType,
          userId: user.id,
          postId,
        },
      });

      return {
        success: true,
        message: `Post ${voteType === "UP" ? "upvoted" : "downvoted"} successfully`,
      };
    }),
  infiniteCommunityPosts: publicProcedure
    .input(
      z.object({
        communityName: z.string(),
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, communityName, userId, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: userId,
            },
          },
        },
        where: {
          subreddit: {
            name: communityName,
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteAuthenticatedPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        communityIds: z.string().array(),
        userId: z.string().optional(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, communityIds, userId, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: userId,
            },
          },
        },
        where: {
          subredditId: {
            in: communityIds,
          },
          isQuestion: false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteGeneralPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        where: {
          isQuestion: false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteUserPosts: publicProcedure
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
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { authorId, currentUserId, skip, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
        },
        where: {
          authorId: authorId,
          isQuestion: false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteVotedPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        voteType: z.nativeEnum(VoteType),
        authorId: z.string(),
        currentUserId: z.string().optional(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, voteType, authorId, currentUserId, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
        },
        where: {
          votes: {
            some: {
              type: voteType,
              userId: authorId,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  delete: protectedProcedure
    .input(PostDeleteValidator)
    .mutation(async (opts) => {
      const { postId } = opts.input;
      const { user } = opts.ctx;

      const post = await db.post.findUnique({
        where: { id: postId },
        include: { author: true, votes: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (user.id !== post.authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this post",
        });
      }

      await db.$transaction(async (tx) => {
        await tx.post.delete({
          where: {
            id: postId,
          },
        });

        if (post.storageUsed > 0) {
          await tx.user.update({
            where: { id: user.id },
            data: {
              storageUsed: {
                decrement: post.storageUsed,
              },
            },
          });

          let imageIds: string[] = [];

          if (post.type === "MEDIA") {
            type MediaPostContent = z.infer<
              typeof MediaPostValidator
            >["content"];

            const mediaPostContent = post.content as MediaPostContent;

            mediaPostContent.images.forEach((image) => {
              imageIds.push(image.id);
            });
          } else if (post.type === "POST") {
            if (!post.content) return;

            (post.content as EditorJSContent).blocks.forEach((block) => {
              if (block.type === "image") imageIds.push(block.data.file.id);
            });
          }

          await ImageKitImageBulkDeleter({ fileIds: imageIds });
        }
      });

      return {
        success: true,
        message: "Post deleted successfully",
      };
    }),
  bookmark: protectedProcedure
    .input(PostBookmarkValidator)
    .mutation(async (opts) => {
      const { postId, remove } = opts.input;
      const { user } = opts.ctx;

      if (remove) {
        const bookmark = await db.bookmark.findFirst({
          where: {
            postId,
            userId: user.id,
          },
        });

        if (!bookmark) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "You have not bookmarked this post",
          });
        }

        await db.bookmark.delete({
          where: { id: bookmark.id },
        });

        return {
          success: true,
          message: "Post unsaved",
        };
      }

      const post = await db.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      await db.bookmark.create({
        data: {
          userId: user.id,
          postId,
        },
      });

      return {
        success: true,
        message: "Post saved",
      };
    }),
  getUrlMetadata: protectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async (opts) => {
      const { url } = opts.input;

      if (!isValidUrl(url)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid URL",
        });
      }
      const metadata = await getUrlMetadata(url);

      if (metadata) {
        const title =
          metadata["title"] ||
          metadata["og:title"] ||
          metadata["twitter:title"] ||
          url;

        const imageUrl = getRelativeUrl(
          url,
          (metadata["og:image"] ||
            metadata["twitter:image"] ||
            (
              metadata["favicons"] as [
                {
                  type: string | null;
                  href: string | null;
                  sizes: string | null;
                },
              ]
            )[0]?.href) as string,
        );

        if (imageUrl) {
          const imageAccessible = await isImageAccessible(imageUrl);

          if (!imageAccessible) {
            return {
              success: 1,
              meta: {
                title: title,
                image: { url: null },
                url: url,
              },
            };
          }
        }

        return {
          success: 1,
          meta: {
            title: title,
            image: { url: imageUrl },
            url: url,
          },
        };
      }

      return {
        success: 0,
        meta: {
          title: url,
          image: { url: null },
          url: url,
        },
      };
    }),
  getUserStorageUsed: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const userWithStorageUsed = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        storageUsed: true,
        storageUnit: true,
      },
    });

    if (!userWithStorageUsed) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      });
    }

    return {
      storageUsed: userWithStorageUsed.storageUsed,
      StorageUnitType: userWithStorageUsed.storageUnit,
    };
  }),
  infinitePopularPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        currentUserId: z.string().optional(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, currentUserId, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { votes: { _count: "desc" } },
          { comments: { _count: "desc" } },
          { createdAt: "desc" },
        ],
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
        },
        where: {
          votes: { some: { type: "UP" } },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteAnswerPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        communityIds: z.string().array(),
        userId: z.string().optional(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, communityIds, userId, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: userId,
            },
          },
        },
        where: {
          subredditId: {
            in: communityIds,
          },
          isQuestion: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteUserQuestions: publicProcedure
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
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { authorId, currentUserId, skip, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          bookmarks: {
            where: {
              userId: currentUserId,
            },
          },
        },
        where: {
          authorId: authorId,
          isQuestion: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
});
