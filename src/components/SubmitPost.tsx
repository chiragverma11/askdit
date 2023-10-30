"use client";

import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { PostValidator } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHotkeyHandler } from "@mantine/hooks";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import Editor from "./Editor";
import { Button } from "./ui/Button";

interface SubmitPostProps {
  communityId: string;
}

type FormData = z.infer<typeof PostValidator>;

const SubmitPost: FC<SubmitPostProps> = ({ communityId }) => {
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<EditorJS>();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: { title: "", content: null, communityId },
  });

  const { ref: titleRef, ...rest } = register("title");

  const { mutate: createPost, isLoading } =
    trpc.post.createCommunityPost.useMutation({
      onSuccess(data) {
        const newPathname = pathname
          .split("/")
          .slice(0, -1)
          .concat(["post", data.postId])
          .join("/");
        toast({
          description: "Your post has been created successfully.",
        });
        router.push(newPathname);
      },
    });

  const onSubmit = async (data: FormData) => {
    const editorBlock = await editorRef.current?.save();

    const payload = {
      title: data.title,
      content: editorBlock,
      communityId,
    };

    createPost(payload);
  };

  return (
    <div className="my-4 w-full rounded-xl border-zinc-200 bg-emphasis px-5 py-5 shadow-xl lg:p-10 lg:pb-6">
      <form onSubmit={handleSubmit(onSubmit)} id="communityPostForm">
        <div className="prose prose-stone w-full dark:prose-invert">
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }}>
            <TextareaAutosize
              maxLength={300}
              ref={(e) => {
                titleRef(e);
                _titleRef.current = e;
              }}
              placeholder="Title"
              className="w-full resize-none overflow-hidden bg-transparent text-2xl font-bold after:w-12 after:content-['Joined'] focus:outline-none lg:text-4xl"
              onKeyDown={getHotkeyHandler([
                [
                  "mod+Enter",
                  () => {
                    submitButtonRef.current?.click();
                  },
                ],
              ])}
              {...rest}
            />
          </motion.div>
          <Editor
            editorRef={editorRef}
            focusTitle={useCallback(() => {
              _titleRef.current?.focus();
            }, [])}
            clickSubmit={useCallback(() => {
              submitButtonRef.current?.click();
            }, [])}
          />
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
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitPost;
