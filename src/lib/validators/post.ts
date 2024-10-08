import { PostType } from "@prisma/client";
import { z } from "zod";
import {
  MEDIA_CAPTION_LENGTH,
  POST_TITLE_LENGTH,
  URL_WITH_OPTIONAL_PROTOCOL_REGEX,
} from "../config";

export const FeedViewTypeSchema = z.enum(["card", "compact"]);

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
  storageUsed: z.number(),
  isQuestion: z.boolean(),
});

export const PostLinkValidator = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(POST_TITLE_LENGTH, {
      message: `Title must be less than ${POST_TITLE_LENGTH} characters long`,
    }),
  content: z.object({
    url: z.string().regex(URL_WITH_OPTIONAL_PROTOCOL_REGEX),
    domain: z.string().min(1),
    ogImage: z.string().url().min(1).optional(),
  }),
  communityId: z.string(),
  type: z.nativeEnum(PostType),
  storageUsed: z.number().default(0),
  isQuestion: z.boolean(),
});

export const MediaPostValidator = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(POST_TITLE_LENGTH, {
      message: `Title must be less than ${POST_TITLE_LENGTH} characters long`,
    }),
  content: z.object({
    type: z.enum(["IMAGE"]),
    images: z
      .object({
        id: z.string(),
        url: z.string().url(),
        caption: z.string().max(MEDIA_CAPTION_LENGTH).optional(),
        size: z.number(),
      })
      .array(),
  }),
  communityId: z.string(),
  type: z.nativeEnum(PostType).default("MEDIA"),
  storageUsed: z.number(),
  isQuestion: z.boolean(),
});

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const PostDeleteValidator = z.object({
  postId: z.string(),
});

export const PostBookmarkValidator = z.object({
  postId: z.string(),
  remove: z.boolean(),
});

export type PostRequestType = z.infer<typeof PostValidator>;
