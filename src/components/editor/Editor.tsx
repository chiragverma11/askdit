// src/components/Editor.tsx
import React from "react";

type EditorProps = React.ComponentPropsWithoutRef<"div">;

const Editor: React.FC<EditorProps> = ({ className, ...props }) => {
  return <div id="editorjs" className={className} {...props} />;
};

export default Editor;
