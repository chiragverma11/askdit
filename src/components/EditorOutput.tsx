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
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output style={style} renderers={renderers} data={content} key="output" />
  );
};

export default EditorOutput;
