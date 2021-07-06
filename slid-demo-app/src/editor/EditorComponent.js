import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";
import { withResizeDetector } from "react-resize-detector";

const AdaptiveWithDetector = withResizeDetector(Editor);

const EditorComponent = () => {
  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <AdaptiveWithDetector />
    </div>
  );
};

export default EditorComponent;
