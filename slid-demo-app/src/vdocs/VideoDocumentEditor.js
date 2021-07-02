import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { setShowSelectAreaCanvas, setIsCapturingFullScreen, setCaptureSelectArea } = props;

  const captureFullScreen = () => {
    setIsCapturingFullScreen(true);
  };

  return (
    <div id="toast-container">
      <EditorComponent setShowSelectAreaCanvas={setShowSelectAreaCanvas} setCaptureSelectArea={setCaptureSelectArea} />
      {/*<button className="btn btn-success btn" onClick={HandleClick}>
        button
      </button>
      <button onClick={captureFullScreen}> FullCapture </button>*/}
    </div>
  );
};

export default VideoDocumentEditor;
