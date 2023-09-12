import { PostValidator, PostVoteValidator } from "@/lib/validators/post";
import { protectedProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";

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
});
