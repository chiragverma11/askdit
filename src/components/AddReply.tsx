"use client";

import { trpc } from "@/lib/trpc";
import {
  AddReplyRequestType,
  AddReplyValidator,
} from "@/lib/validators/comment";
import { InfinitePostCommentsOutput } from "@/types/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/Button";

interface AddReplyProps {
  postId: string;
  addNewReply: (
    newReply: Pick<InfinitePostCommentsOutput, "comments">["comments"][number],
  ) => void;
  replyToId: string;
  onCancel?: () => void;
}

const addReplyFormSchema = AddReplyValidator;

const AddReply: FC<AddReplyProps> = ({
  postId,
  addNewReply,
  replyToId,
  onCancel,
}) => {
  const { handleSubmit, register, reset } = useForm<AddReplyRequestType>({
    resolver: zodResolver(addReplyFormSchema),
    defaultValues: {
      comment: "",
      postId,
      replyToId,
    },
  });

  const { ref: commentRef, ...rest } = register("comment");

  const formId = `addReplyForm_${replyToId}`;

  const { mutate: addReply, isLoading } = trpc.comment.addReply.useMutation({
    onSuccess(data) {
      reset({
        comment: "",
        postId,
        replyToId,
      });

      addNewReply(data?.comment);
    },
  });

  const onSubmit = (data: AddReplyRequestType) => {
    addReply(data);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-default/40 focus-within:border-default/90">
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <TextareaAutosize
          placeholder="What are your thoughts?"
          className="h-28 max-h-28 w-full resize-none overflow-hidden overflow-y-auto bg-transparent px-4 py-2 focus:outline-none lg:max-h-none lg:min-h-[32px] lg:resize-y"
          minRows={5}
          autoFocus={true}
          ref={(e) => commentRef(e)}
          {...rest}
        />
        <div className="flex w-full bg-subtle px-2 py-1.5">
          <div className="ml-auto flex items-center gap-2 self-end">
            <Button
              size={"xs"}
              type="button"
              className="h-7 self-end rounded-lg bg-transparent px-4 text-sm font-semibold text-default hover:bg-zinc-500/50 dark:hover:bg-zinc-500/50"
              disabled={isLoading}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form={formId}
              size={"xs"}
              className="h-7 rounded-lg bg-zinc-700 px-4 text-sm font-semibold text-inverted hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-400"
              isLoading={isLoading}
            >
              Reply
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddReply;
