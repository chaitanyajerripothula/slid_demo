import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";

const EditorComponent = (props) => {
  const { setIsCapturingOneClick, capturedImageUrl} = props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <Editor setIsCapturingOneClick={setIsCapturingOneClick} capturedImageUrl={capturedImageUrl}/>
    </div>
  );
};

export default EditorComponent;
