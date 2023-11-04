import { PostType } from "@prisma/client";
import { z } from "zod";
import { POST_TITLE_LENGTH } from "../config";

export const PostValidator = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(POST_TITLE_LENGTH, {
      message: `Title must be less than ${POST_TITLE_LENGTH} characters long`,
    }),
  content: z.any(),
  communityId: z.string(),
  type: z.nativeEnum(PostType),
});

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const PostDeleteValidator = z.object({
  postId: z.string(),
});

export type PostRequestType = z.infer<typeof PostValidator>;
