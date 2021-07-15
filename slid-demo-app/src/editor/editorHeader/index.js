import React from "react";
import styles from "./editorHeader.module.css";

const EditorHeader = () => {
  const slidDownloadURL = "https://chrome.google.com/webstore/detail/video-screenshot-note-tak/cgajiilhmpfemmdihjnodpibaffakjhj";

  return (
    <div className={`${styles[`editor-header-container`]}`}>
      <a href={slidDownloadURL} target="_blank">슬리드 다운로드 →</a>
    </div>
  );
};

export default EditorHeader;
