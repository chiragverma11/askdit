"use client";

import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  AddCommentRequestType,
  AddCommentValidator,
} from "@/lib/validators/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import AuthLink from "./AuthLink";
import { Button, buttonVariants } from "./ui/Button";

interface AddCommentProps {
  postId: string;
  refetchComments: () => void;
  user?: any;
}

const addCommentFormSchema = AddCommentValidator;

const AddComment: FC<AddCommentProps> = ({ postId, refetchComments, user }) => {
  const { handleSubmit, register, reset } = useForm<AddCommentRequestType>({
    resolver: zodResolver(addCommentFormSchema),
    defaultValues: {
      comment: "",
      postId,
    },
  });

  const { ref: commentRef, ...rest } = register("comment");

  const { mutate: addComment, isLoading } =
    trpc.comment.addPostComment.useMutation({
      onSuccess() {
        reset({
          comment: "",
          postId,
        });
        refetchComments();
      },
    });

  const onSubmit = (data: AddCommentRequestType) => {
    addComment(data);
  };

  return (
    <>
      {user !== undefined ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-default/40 focus-within:border-default/90">
          <form id="addCommentForm" onSubmit={handleSubmit(onSubmit)}>
            <TextareaAutosize
              placeholder="What are your thoughts?"
              className="h-28 max-h-28 w-full resize-none overflow-hidden overflow-y-auto bg-transparent px-4 py-2 focus:outline-none lg:max-h-none lg:min-h-[32px] lg:resize-y"
              minRows={5}
              ref={(e) => commentRef(e)}
              {...rest}
            />
            <div className="flex w-full bg-subtle px-2 py-1.5">
              <Button
                type="submit"
                form="addCommentForm"
                size={"xs"}
                className="ml-auto h-7 self-end rounded-lg bg-zinc-700 px-4 text-sm font-semibold text-inverted hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-400"
                isLoading={isLoading}
              >
                Comment
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <AuthLink
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex w-fit items-center rounded-3xl border border-default/60 font-semibold hover:border-default hover:bg-transparent",
          )}
        >
          <Plus className="mr-1 h-4 w-4" /> Add a Comment
        </AuthLink>
      )}
    </>
  );
};

export default AddComment;
