"use client";

import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { PostValidator } from "@/lib/validators/post";
import "@/styles/editor.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "../Icons";
import { Button } from "../ui/Button";
import SubmitPostTitle from "./SubmitPostTitle";

interface CreateEditorPostProps {
  communityId: string | undefined;
  isQuestion: boolean;
  className?: string;
}

type FormData = z.infer<typeof PostValidator>;

const CreateEditorPost: FC<CreateEditorPostProps> = ({
  communityId,
  isQuestion,
  className,
}) => {
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const disabled = useMemo(() => (communityId ? false : true), [communityId]);

  const postType: PostType = "POST";

  const { register, watch, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: null,
      communityId,
      type: postType,
      storageUsed: 0,
      isQuestion: isQuestion,
    },
  });

  const { ref: titleValidationRef, ...rest } = register("title");

  const { mutate: createPost, isLoading } =
    trpc.post.createCommunityPost.useMutation({
      onSuccess(data) {
        const newPathname = pathname
          .split("/")
          .slice(0, -1)
          .concat(["post", data.postId])
          .join("/");
        toast.success("Your post has been created successfully.");
        router.push(newPathname);
      },
      onError(error) {
        toast.error("Failed to create post", {
          description: error.message,
        });
      },
    });

  const { api, Editor, editorContainerRef, isEditorLoading, storageUsed } =
    useEditor({
      onEditorReady: () => {
        _titleRef.current?.focus();
      },
      disabled,
    });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!api) return;

      const editorOutputData = await api.save();

      data.content = editorOutputData;
      data.storageUsed = storageUsed;

      createPost(data);
    },
    [api, storageUsed, createPost],
  );

  return (
    <div className={className} ref={editorContainerRef}>
      <form onSubmit={handleSubmit(onSubmit)} id="communityPostForm">
        <div className="prose prose-stone w-full dark:prose-invert">
          <SubmitPostTitle
            titleLength={watch("title").length}
            titleValidationRef={titleValidationRef}
            useFormRegisterRest={rest}
            _titleRef={_titleRef}
            submitButtonRef={submitButtonRef}
            disabled={disabled}
            placeholder={isQuestion ? "Ask here" : "Title"}
          />
          <div className="min-h-[215px]">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: "100%" }}
                exit={{ opacity: 0 }}
                className={cn(
                  "full flex items-center justify-center",
                  !isEditorLoading || disabled ? "hidden" : "",
                )}
              >
                <Icons.loader
                  strokeWidth={2.5}
                  className="h-8 w-8 animate-spin text-blue-500/75 lg:h-auto lg:w-auto"
                />
              </motion.div>
            </AnimatePresence>
            <Editor />
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <p className="hidden text-sm text-gray-500 md:inline">
              Use{" "}
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                Tab
              </kbd>{" "}
              to open the command menu.
            </p>
            <Button
              type="submit"
              form="communityPostForm"
              className="self-end px-6 py-1 font-semibold"
              isLoading={isLoading}
              ref={submitButtonRef}
              disabled={disabled}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEditorPost;
