import { User } from "next-auth";
import { NextRequest } from "next/server";

type CreateContextOptions = {
  req: NextRequest;
  user?: User;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return opts;
};

export const createTRPCContext = (opts: { req: NextRequest }) => {
  return createInnerTRPCContext({
    ...opts,
  });
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
