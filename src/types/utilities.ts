import { getUserBookmarks, type getUserComments } from "@/lib/prismaQueries";
import { FeedViewTypeSchema } from "@/lib/validators/post";
import { z } from "zod";

export type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType,
> = {
  // Loop to every key. We gonna check if the key
  // is assignable to Keys. If yes, change the type.
  // Else, retain the type.
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

// This is a type that will allow us to get the type of the Prisma Queries from functions
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Custom Types
 */

export type UserComments = Pick<
  ThenArg<ReturnType<typeof getUserComments>>,
  "userComments"
>["userComments"];

export type UserBookmarks = ThenArg<ReturnType<typeof getUserBookmarks>>;

export type FeedViewType = z.infer<typeof FeedViewTypeSchema>;

type UploadStatus = "uploading" | "uploaded" | "idle" | "failed";

export type Media = {
  file: File;
  preview: string;
  id?: string;
  url?: string;
  caption?: string;
  uploadStatus: UploadStatus;
};
