import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";
import { withResizeDetector } from "react-resize-detector";

const EditorAdaptiveWithDetector = withResizeDetector(Editor);

const EditorComponent = (props) => {
  const { selectAreaCoordinate, captureImgUrl, isCapturingOneClick, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureSelectArea, setCaptureImgUrl, setIsCapturingOneClick, lang, isMacOs } =
    props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <EditorAdaptiveWithDetector
        selectAreaCoordinate={selectAreaCoordinate}
        captureImgUrl={captureImgUrl}
        isCapturingOneClick={isCapturingOneClick}
        setSelectAreaCoordinate={setSelectAreaCoordinate}
        setShowSelectAreaCanvas={setShowSelectAreaCanvas}
        setCaptureSelectArea={setCaptureSelectArea}
        setCaptureImgUrl={setCaptureImgUrl}
        setIsCapturingOneClick={setIsCapturingOneClick}
        lang={lang}
        isMacOs={isMacOs}
      />
    </div>
  );
};

export default EditorComponent;
