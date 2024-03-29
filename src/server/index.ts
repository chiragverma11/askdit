import { bookmarkRouter } from "./routers/bookmark";
import { commentRouter } from "./routers/comment";
import { communityRouter } from "./routers/community";
import { postRouter } from "./routers/post";
import { searchRouter } from "./routers/search";
import { router } from "./trpc";

export const appRouter = router({
  community: communityRouter,
  post: postRouter,
  comment: commentRouter,
  bookmark: bookmarkRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
