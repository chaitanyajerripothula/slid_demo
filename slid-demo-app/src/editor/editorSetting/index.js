import React, { useEffect, useState } from "react";
import styles from "./editorSetting.module.css";
const EditorSetting = () => {
  const [fontSize, setFontSize] = useState("Small");
  const ChangeFontSize = (e) => {
    const value = e.target.value;
    setFontSize(value);
    console.log(`fontSize : ${fontSize}`);
  };

  return (
    <div className={styles.editor_setting_container}>
      <span className={styles.editor_setting_container_title}>에디터 설정</span>
      <div className={styles.editor_setting_container_item}>
        폰트 크기
        <select value={fontSize} onChange={ChangeFontSize}>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>
    </div>
  );
};

//.EditorComponent_editor-wrapper__19Y8i .EditorComponent_editor-content-container__feDq4.EditorComponent_font-large__3tnqQ
export default EditorSetting;
