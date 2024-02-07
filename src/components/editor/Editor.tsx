// src/components/Editor.tsx
import React from "react";

interface EditorProps extends React.ComponentPropsWithoutRef<"div"> {}

const Editor: React.FC<EditorProps> = ({ className, ...props }) => {
  return <div id="editorjs" className={className} {...props} />;
};

export default Editor;
