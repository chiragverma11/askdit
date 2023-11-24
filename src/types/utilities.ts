import { RouterOutputs } from "@/lib/trpc";

export type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

/**
 * Custom Types
 */

export type InfinitePostCommentsOutput =
  RouterOutputs["comment"]["infiniteComments"];
