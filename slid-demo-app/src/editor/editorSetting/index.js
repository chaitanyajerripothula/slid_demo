import React from "react";
import styles from "./editorSetting.module.css";

const EditorSetting = (props) => {
  const ChangeFontSize = (e) => {
    const value = e.target.value;
    props.setFontSize(value);
  };

  return (
    <div className={`${styles[`editor-setting-container`]}`}>
      <span className={`${styles[`editor-setting-container-title`]}`}>에디터 설정</span>
      <div className={`${styles[`editor-setting-container-item`]}`}>
        <span>폰트 크기</span>
        <select className={`${styles[`editor-setting-select`]} custom-select custom-select-sm`} onChange={ChangeFontSize}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
};

export default EditorSetting;
