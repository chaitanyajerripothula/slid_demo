import React, { useCallback, useState } from "react";
import styles from "./editorSetting.module.css";

const FONT_SIZE_OPTIONS = [
  { key: "Small", value: "small" },
  { key: "Medium", value: "medium" },
  { key: "Large", value: "large" },
];

const EditorSetting = (props) => {
  const [optionValue, setOptionValue] = useState(props.fontSize);

  const ChangeFontSize = useCallback(
    (e) => {
      const value = e.target.value;
      props.setFontSize(value);
      setOptionValue(e.target.value);
    },
    [optionValue]
  );

  return (
    <div className={`${styles[`editor-setting-container`]}`}>
      <span className={`${styles[`editor-setting-container-title`]}`}>에디터 설정</span>
      <div className={`${styles[`editor-setting-container-item`]}`}>
        <span>폰트 크기</span>
        <select className={`${styles[`editor-setting-select`]} custom-select custom-select-sm`} onChange={ChangeFontSize} value={optionValue}>
          {FONT_SIZE_OPTIONS.map((fontOption) => {
            return (
              <option key={fontOption.key} value={fontOption.value}>
                {fontOption.key}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default EditorSetting;
