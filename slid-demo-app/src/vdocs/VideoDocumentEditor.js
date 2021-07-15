import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { selectAreaCoordinate, captureImgUrl, isCapturingOneClick, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureImgUrl, setIsCapturingOneClick, setCaptureSelectArea, isMacOs, lang } =
    props;

  return (
    <div id="toast-container">
      <EditorComponent
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

export default VideoDocumentEditor;
