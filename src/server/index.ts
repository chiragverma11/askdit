import { router } from "./trpc";
import { commentRouter } from "./routers/comment";
import { communityRouter } from "./routers/community";
import { postRouter } from "./routers/post";

export const appRouter = router({
  community: communityRouter,
  post: postRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
