import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";

const EditorComponent = (props) => {
  const { setIsCapturingOneClick } = props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <Editor setIsCapturingOneClick={setIsCapturingOneClick}/>
    </div>
  );
};

export default EditorComponent;
