import dynamic from "next/dynamic";
import { FC } from "react";
// const Output = dynamic(
//   async () => (await import("editorjs-react-renderer")).default,
//   { ssr: false },
// );
import Output from "editorjs-react-renderer";

interface EditorOutputProps {
  content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return <Output data={content} className="text-sm" />;
};

export default EditorOutput;
