import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 300 characters long",
    }),
  content: z.any(),
  communityId: z.string(),
});

export type PostRequestType = z.infer<typeof PostValidator>;
