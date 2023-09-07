"use client";

import { useMounted } from "@/hooks/use-mounted";
import { uploadFiles } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import "@/styles/editor.css";
import EditorJS from "@editorjs/editorjs";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/Button";

interface EditorProps {
  communityId?: string;
}

const Editor: FC<EditorProps> = ({ communityId }) => {
  const [editorLoading, setEditorLoading] = useState(true);
  const editorRef = useRef<EditorJS>();
  const isMounted = useMounted();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Paragraph = (await import("@editorjs/paragraph")).default;
    const List = (await import("@editorjs/list")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const CodeTool = (await import("@editorjs/code")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Table = (await import("@editorjs/table")).default;
    const Strikethrough = (await import("@sotaproject/strikethrough")).default;
    const DragDrop = (await import("editorjs-drag-drop")).default;

    const editor = new EditorJS({
      holderId: "editorjs",
      onReady() {
        setEditorLoading(false);
        editorRef.current = editor;
        new DragDrop(editor);
      },
      autofocus: true,
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
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/link",
          },
        },
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const [res] = await uploadFiles({
                  files: [file],
                  endpoint: "imageUploader",
                });
                return {
                  success: 1,
                  file: {
                    url: res.url,
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

  return (
    <div className="my-4 w-full rounded-xl border-zinc-200 bg-emphasis px-5 py-5 shadow-xl lg:p-10 lg:pb-6">
      <div className="prose prose-stone dark:prose-invert">
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }}>
          <TextareaAutosize
            maxLength={300}
            ref={(e) => {
              titleRef.current = e;
            }}
            placeholder="Title"
            className="w-full resize-none overflow-hidden bg-transparent text-2xl font-bold after:w-12 after:content-['Joined'] focus:outline-none lg:text-4xl"
          />
        </motion.div>
        <div className="min-h-[250px]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: "100%" }}
              exit={{ opacity: 0 }}
              className={cn(
                "full flex justify-center",
                !editorLoading ? "hidden" : "",
              )}
            >
              <Loader2
                strokeWidth={2.75}
                className="animate-spin text-blue-500/75"
              />
            </motion.div>
          </AnimatePresence>
          <div id="editorjs"></div>
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
            form=""
            className="self-end px-6 py-1 font-semibold"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
