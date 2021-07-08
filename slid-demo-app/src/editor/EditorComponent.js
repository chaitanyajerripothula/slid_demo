import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";
import { withResizeDetector } from "react-resize-detector";

const EditorAdaptiveWithDetector = withResizeDetector(Editor);

const EditorComponent = (props) => {
  const { lang, isMacOs } = props;
  return (
    <div className={`${styles[`container`]}`}>
      <EditorAdaptiveWithDetector lang={lang} isMacOs={isMacOs} />
    </div>
  );
};

export default EditorComponent;
