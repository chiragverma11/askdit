import { router } from "../trpc";
import { commentRouter } from "./comment";
import { communityRouter } from "./community";
import { postRouter } from "./post";

export const appRouter = router({
  community: communityRouter,
  post: postRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
