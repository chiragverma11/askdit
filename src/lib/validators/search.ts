import { z } from "zod";

export const SearchFormValidator = z.object({
  query: z.string().min(1, "Search query must not be empty"),
});

export type SearchRequestType = z.infer<typeof SearchFormValidator>;
