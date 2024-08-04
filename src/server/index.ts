import { bookmarkRouter } from "./routers/bookmark";
import { commentRouter } from "./routers/comment";
import { communityRouter } from "./routers/community";
import { notificationRouter } from "./routers/notification";
import { postRouter } from "./routers/post";
import { searchRouter } from "./routers/search";
import { settingsRouter } from "./routers/settings";
import { router } from "./trpc";

export const appRouter = router({
  community: communityRouter,
  post: postRouter,
  comment: commentRouter,
  bookmark: bookmarkRouter,
  search: searchRouter,
  settings: settingsRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
