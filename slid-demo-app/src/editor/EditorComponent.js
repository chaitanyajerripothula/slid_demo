import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";

const EditorComponent = () => {
  return (
    <div className={`${styles[`container`]}`}>
      <Editor />
    </div>
  );
};

export default EditorComponent;
