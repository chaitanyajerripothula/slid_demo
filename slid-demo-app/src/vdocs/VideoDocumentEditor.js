import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { selectAreaCoordinate, captureImgUrl, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureImgUrl, setIsCapturingOneClick, setCaptureSelectArea } = props;

  return (
    <div id="toast-container">
      <EditorComponent
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

export default VideoDocumentEditor;
