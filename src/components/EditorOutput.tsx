"use client";

import dynamic from "next/dynamic";
import { FC } from "react";
import CustomImageRenderer from "./renderers/CustomImageRenderer";
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);

const renderers = {
  image: CustomImageRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  linkTool: {
    color: "red",
    borderRadius: "1rem",
  },
};

interface EditorOutputProps {
  content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
      key="output"
    />
  );
};

export default EditorOutput;
