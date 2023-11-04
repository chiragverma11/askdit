"use client";

import { useMounted } from "@/hooks/use-mounted";
import {
  IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER,
} from "@/lib/config";
import { ImageKitImageUploader } from "@/lib/imagekit/imageUploader";
import { cn } from "@/lib/utils";
import "@/styles/editor.css";
import EditorJS from "@editorjs/editorjs";
import { getHotkeyHandler } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FC, MutableRefObject, useCallback, useEffect, useState } from "react";

interface EditorProps {
  editorRef: MutableRefObject<EditorJS | undefined>;
  focusTitle: () => void;
  clickSubmit: () => void;
}

const Editor: FC<EditorProps> = ({ editorRef, focusTitle, clickSubmit }) => {
  const [editorLoading, setEditorLoading] = useState(true);
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
      holder: "editorjs",
      onReady() {
        setEditorLoading(false);
        editorRef.current = editor;
        new DragDrop(editor);
        focusTitle();
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
  }, [editorRef, focusTitle]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (isMounted) {
      init();
    }
    return () => {
      editorRef.current?.destroy();
      editorRef.current = undefined;
    };
  }, [isMounted, initializeEditor, editorRef]);

  return (
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
        onKeyDown={getHotkeyHandler([["mod+Enter", clickSubmit]])}
      ></div>
    </div>
  );
};

export default Editor;
