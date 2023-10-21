import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { db } from "@/lib/db";
import { PostValidator, PostVoteValidator } from "@/lib/validators/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  createCommunityPost: protectedProcedure
    .input(PostValidator)
    .mutation(async (opts) => {
      const { communityId, title, content } = opts.input;
      const { user } = opts.ctx;

      const subscription = await db.subscription.findFirst({
        where: {
          subredditId: communityId,
          userId: user.id,
        },
      });

      if (!subscription) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Subscribe to Post",
        });
      }

      const post = await db.post.create({
        data: {
          title: title,
          content: content,
          subredditId: communityId,
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
});
