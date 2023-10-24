import { z } from "zod";

export const AddCommentValidator = z.object({
  comment: z.string().min(1),
  postId: z.string(),
});

export const AddReplyValidator = z.object({
  comment: z.string().min(1),
  postId: z.string(),
  replyToId: z.string(),
});

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const CommentDeleteValidator = z.object({
  commentId: z.string(),
});

export type AddCommentRequestType = z.infer<typeof AddCommentValidator>;
export type AddReplyRequestType = z.infer<typeof AddReplyValidator>;
