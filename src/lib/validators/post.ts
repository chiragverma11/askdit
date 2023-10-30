import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(300, {
      message: "Title must be less than 300 characters long",
    }),
  content: z.any(),
  communityId: z.string(),
});

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const PostDeleteValidator = z.object({
  postId: z.string(),
});

export type PostRequestType = z.infer<typeof PostValidator>;
