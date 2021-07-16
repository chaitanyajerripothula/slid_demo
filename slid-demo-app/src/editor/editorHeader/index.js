import React from "react";
import styles from "./editorHeader.module.css";

const EditorHeader = () => {
  const slidDownloadURL = "https://chrome.google.com/webstore/detail/video-screenshot-note-tak/cgajiilhmpfemmdihjnodpibaffakjhj";

  return (
    <div className={`${styles[`editor-header-container`]}`}>
      <span>
        <a className={`${styles[`editor-header-link`]}`} href={slidDownloadURL} target="_blank">
          슬리드 설치하러 가기{" "}
        </a>
        👉🏻
      </span>
    </div>
  );
};

export default EditorHeader;
