"use client";

import { useMounted } from "@/hooks/use-mounted";
import { toast } from "@/hooks/use-toast";
import {
  IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER,
  POST_TITLE_LENGTH,
} from "@/lib/config";
import { ImageKitImageUploader } from "@/lib/imagekit/imageUploader";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { PostValidator } from "@/lib/validators/post";
import "@/styles/editor.css";
import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHotkeyHandler } from "@mantine/hooks";
import { PostType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { Button } from "./ui/Button";

interface EditorProps {
  communityId: string;
  className?: string;
}

type FormData = z.infer<typeof PostValidator>;

const Editor: FC<EditorProps> = ({ communityId, className }) => {
  const [editorLoading, setEditorLoading] = useState(true);
  const editorRef = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useMounted();

  const postType: PostType = "POST";

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: { title: "", content: null, communityId, type: postType },
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

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Paragraph = (await import("@editorjs/paragraph")).default;
    const List = (await import("@editorjs/list")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const Embed = (await import("@editorjs/embed")).default;
    // const LinkTool = (await import("@editorjs/link")).default;
    const CodeTool = (await import("@editorjs/code")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Table = (await import("@editorjs/table")).default;
    const Strikethrough = (await import("@sotaproject/strikethrough")).default;
    const DragDrop = (await import("editorjs-drag-drop")).default;

    const editor = new EditorJS({
      holder: "editorjs",
      onReady() {
        setEditorLoading(false);
        editorRef.current = editor;
        new DragDrop(editor);
        _titleRef.current?.focus();
      },
      placeholder: "Type here to write your post...",
      inlineToolbar: true,

      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
          config: {
            placeholder: "Header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        // linkTool: {
        //   class: LinkTool,
        //   config: {
        //     endpoint: "/api/link",
        //   },
        // },
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const res = await ImageKitImageUploader({
                  file,
                  fileName: file.name,
                  folder: IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER,
                });
                return {
                  success: 1,
                  file: {
                    url: `${res?.url}?width=${res?.width}&height=${res?.height}`,
                  },
                };
              },
            },
          },
        },
        code: CodeTool,
        table: Table,
        embed: Embed,
        inlineCode: {
          class: InlineCode,
          shortcut: "CTRL+SHIFT+M",
        },
        strikethrough: Strikethrough,
      },
      // data: { blocks: [] },
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (isMounted) {
      init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const onSubmit = async (data: FormData) => {
    const editorBlock = await editorRef.current?.save();

    const payload = {
      title: data.title,
      content: editorBlock,
      communityId,
      type: postType,
    };

    createPost(payload);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} id="communityPostForm">
        <div className="prose prose-stone w-full dark:prose-invert">
          <motion.div
            className="relative"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
          >
            <TextareaAutosize
              maxLength={POST_TITLE_LENGTH}
              ref={(e) => {
                titleRef(e);
                _titleRef.current = e;
              }}
              placeholder="Title"
              className="w-full resize-none overflow-hidden bg-transparent pr-12 text-2xl font-bold after:w-12 after:content-['Joined'] focus:outline-none lg:pr-10 lg:text-4xl"
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
            <span className="pointer-events-none absolute bottom-4 right-0 text-xxs font-semibold text-subtle">{`${
              watch("title").length
            }/${POST_TITLE_LENGTH}`}</span>
          </motion.div>
          <div className="min-h-[250px]">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: "100%" }}
                exit={{ opacity: 0 }}
                className={cn(
                  "full flex items-center justify-center",
                  !editorLoading ? "hidden" : "",
                )}
              >
                <Loader2
                  strokeWidth={2.5}
                  className="h-8 w-8 animate-spin text-blue-500/75 lg:h-auto lg:w-auto"
                />
              </motion.div>
            </AnimatePresence>
            <div
              id="editorjs"
              onKeyDown={getHotkeyHandler([
                [
                  "mod+Enter",
                  () => {
                    submitButtonRef.current?.click();
                  },
                ],
              ])}
            ></div>
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
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;
