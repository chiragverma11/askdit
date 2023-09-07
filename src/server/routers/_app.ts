import { router } from "../trpc";
import { communityRouter } from "./community";
import { postRouter } from "./post";

export const appRouter = router({
  community: communityRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
