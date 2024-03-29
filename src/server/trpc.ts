import { getAuthSession } from "@/lib/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;

// to check if user is authenticated
const isAuth = middleware(async (opts) => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = session?.user;

  return opts.next({ ctx: { user } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuth);
