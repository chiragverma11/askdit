import { PostValidator } from "@/lib/validators/post";
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
});
