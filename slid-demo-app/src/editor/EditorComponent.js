import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";

const EditorComponent = (props) => {
  const { setShowSelectAreaCanvas, setCaptureSelectArea } = props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <Editor setShowSelectAreaCanvas={setShowSelectAreaCanvas} setCaptureSelectArea={setCaptureSelectArea} />
    </div>
  );
};

export default EditorComponent;
