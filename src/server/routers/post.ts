import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { db } from "@/lib/db";
import {
  getRelativeUrl,
  getUrlMetadata,
  isImageAccessible,
  isValidUrl,
} from "@/lib/utils";
import {
  PostDeleteValidator,
  PostValidator,
  PostVoteValidator,
} from "@/lib/validators/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  createCommunityPost: protectedProcedure
    .input(PostValidator)
    .mutation(async (opts) => {
      const { communityId, title, content, type } = opts.input;
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

      const post = await db.post.create({
        data: {
          title: title,
          content: content,
          subredditId: communityId,
          type: type,
          authorId: user.id,
        },
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
        return new Response("Post not found", { status: 404 });
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

          return new Response("OK");
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

        return new Response("OK");
      }

      await db.vote.create({
        data: {
          type: voteType,
          userId: user.id,
          postId,
        },
      });

      return new Response("OK");
    }),
  infiniteCommunityPosts: publicProcedure
    .input(
      z.object({
        communityName: z.string(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, communityName, cursor } = input;

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
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, communityIds, cursor } = input;

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
          subredditId: {
            in: communityIds,
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
        return new Response("Post not found", { status: 404 });
      }

      if (user.id !== post.authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      await db.post.delete({
        where: {
          id: postId,
        },
      });

      return new Response("OK");
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
});
