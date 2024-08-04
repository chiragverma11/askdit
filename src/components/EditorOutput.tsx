"use client";

import dynamic from "next/dynamic";
import { FC } from "react";
import LoadingEditorOutput from "./LoadingEditorOutput";
import CustomImageRenderer from "./renderers/CustomImageRenderer";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false, loading: LoadingEditorOutput },
);

const renderers = {
  image: CustomImageRenderer,
};

interface Style {
  [key: string]: React.CSSProperties | Style;
}

const style: Style = {
  paragraph: {
    margin: "8px 0px",
    textAlign: "left",
  },
};

interface EditorOutputProps {
  content: any;
  limitHeight: boolean;
}

const EditorOutput: FC<EditorOutputProps> = ({ content, limitHeight }) => {
  return (
    <div
      className={cn(
        limitHeight &&
          "relative max-h-[300px] overflow-hidden after:pointer-events-none after:absolute after:top-[268px] after:z-[1] after:block after:h-8 after:w-full after:bg-gradient-to-t after:from-emphasis",
      )}
    >
      {limitHeight && (
        <Icons.chevronDown className="pointer-events-none absolute inset-x-0 top-[275px] z-[2] mx-auto h-5 w-5 text-default drop-shadow" />
      )}
      <Output style={style} renderers={renderers} data={content} key="output" />
    </div>
  );
};

export default EditorOutput;
