"use client";

import { useMounted } from "@/hooks/use-mounted";
import EditorJS from "@editorjs/editorjs";
import { FC, useCallback, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@/styles/editor.css";
import { Button } from "./ui/Button";
import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  communityId?: string;
}

const Editor: FC<EditorProps> = ({ communityId }) => {
  const ref = useRef<EditorJS>();
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
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
        ref.current = editor;
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
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        list: List,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/link",
          },
        },
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
        embed: Embed,
        code: CodeTool,
        inlineCode: {
          class: InlineCode,
          shortcut: "CTRL+SHIFT+M",
        },
        table: Table,
        strikethrough: Strikethrough,
      },
      data: { blocks: [] },
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  return (
    <div className="my-4 w-full rounded-xl border-zinc-200 bg-emphasis px-2 py-2 shadow-xl lg:p-10 lg:pb-6">
      <div className="prose prose-stone dark:prose-invert">
        <TextareaAutosize
          maxLength={300}
          ref={(e) => {
            titleRef.current = e;
          }}
          placeholder="Title"
          className="w-full resize-none overflow-hidden bg-transparent text-2xl font-bold after:w-12 after:content-['Joined'] focus:outline-none lg:text-4xl"
        />
        <div id="editorjs" className="min-h-[250px]"></div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
          <Button type="submit" form="" className="px-6 py-1 font-semibold">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
