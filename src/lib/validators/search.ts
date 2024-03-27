import { z } from "zod";

export const SearchFormValidator = z.object({
  query: z.string().min(1, "Search query must not be empty"),
});

export const SearchTypeValidator = z
  .enum(["post", "comment", "community", "user"])
  .default("post");

export type SearchType = z.infer<typeof SearchTypeValidator>;

export type SearchRequestType = z.infer<typeof SearchFormValidator>;
