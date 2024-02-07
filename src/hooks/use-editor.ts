import * as React from "react";

import Editor from "@/components/editor/Editor";
import { toast } from "@/hooks/use-toast";
import { IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER } from "@/lib/config";
import { ImageKitImageUploader } from "@/lib/imagekit/imageUploader";
import { addResolutionToImageUrl } from "@/lib/utils";
import EditorJS from "@editorjs/editorjs";
import { useIntersection } from "@mantine/hooks";

interface EditorProps {
  onEditorReady?: () => void;
  disabled?: boolean;
}

export function useEditor({ onEditorReady, disabled }: EditorProps) {
  const [isEditorLoading, setIsEditorLoading] = React.useState(true);
  const [isIntersected, setIsIntersected] = React.useState(false);

  const { ref: editorContainerRef, entry } = useIntersection({
    threshold: 0.1,
  });

  const isIntersecting = React.useMemo(
    () => entry?.isIntersecting,
    [entry?.isIntersecting],
  );

  const editorRef = React.useRef<EditorJS>();

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Paragraph = (await import("@editorjs/paragraph")).default;
    const List = (await import("@editorjs/list")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const CodeTool = (await import("@editorjs/code")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Table = (await import("@editorjs/table")).default;
    const Strikethrough = (await import("@sotaproject/strikethrough")).default;
    const DragDrop = (await import("editorjs-drag-drop")).default;

    const editor = new EditorJS({
      holder: "editorjs",
      onReady() {
        setIsEditorLoading(false);
        editorRef.current = editor;
        new DragDrop(editor);
        if (onEditorReady) {
          onEditorReady();
        }
      },
      placeholder: "Type here to write your post... (optional)",
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
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const response = await ImageKitImageUploader({
                  file,
                  folder: IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER,
                });

                if (response.success !== 1) {
                  toast({
                    title: "Upload failed",
                    description: "Please try again later",
                  });
                }
                return {
                  success: 1,
                  file: {
                    url: addResolutionToImageUrl(
                      response.result?.url,
                      response.result?.width,
                      response.result?.height,
                    ),
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
    });
  }, [onEditorReady]);

  React.useEffect(() => {
    const init = async () => {
      await initializeEditor();
      isIntersecting && !isIntersected && setIsIntersected(true);
    };

    if (isIntersecting && !disabled && !isIntersected) {
      init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [initializeEditor, isIntersecting, isIntersected, disabled]);

  return {
    api: editorRef.current,
    isEditorLoading,
    editorContainerRef,
    Editor,
  };
}
