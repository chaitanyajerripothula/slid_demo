import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { selectAreaCoordinate, captureImgUrl, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureImgUrl, setIsCapturingFullScreen, setCaptureSelectArea } = props;

  const captureFullScreen = () => {
    setIsCapturingFullScreen(true);
  };

  return (
    <div id="toast-container">
      <EditorComponent
        selectAreaCoordinate={selectAreaCoordinate}
        captureImgUrl={captureImgUrl}
        setSelectAreaCoordinate={setSelectAreaCoordinate}
        setShowSelectAreaCanvas={setShowSelectAreaCanvas}
        setCaptureSelectArea={setCaptureSelectArea}
        setCaptureImgUrl={setCaptureImgUrl}
      />
      {/*<button className="btn btn-success btn" onClick={HandleClick}>
        button
      </button>
      <button onClick={captureFullScreen}> FullCapture </button>*/}
    </div>
  );
};

export default VideoDocumentEditor;
