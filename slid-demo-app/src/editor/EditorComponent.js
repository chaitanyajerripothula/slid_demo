import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";

const EditorComponent = (props) => {
  const { selectAreaCoordinate, captureImgUrl, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureSelectArea, setCaptureImgUrl, setIsCapturingOneClick } = props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <Editor
        selectAreaCoordinate={selectAreaCoordinate}
        captureImgUrl={captureImgUrl}
        setSelectAreaCoordinate={setSelectAreaCoordinate}
        setShowSelectAreaCanvas={setShowSelectAreaCanvas}
        setCaptureSelectArea={setCaptureSelectArea}
        setCaptureImgUrl={setCaptureImgUrl}
        setIsCapturingOneClick={setIsCapturingOneClick}
      />
    </div>
  );
};

export default EditorComponent;
