import Swal from "sweetalert2";
import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { setShowSelectAreaCanvas, setIsCapturingOneClick, setCaptureSelectArea, capturedImageUrl } = props;

  const captureOneClick = () => {
    setIsCapturingOneClick(true);
  }

  const HandleClick = () => {
    setShowSelectAreaCanvas(true)
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "👈 캡쳐할 영역을 선택해주세요.",
      html: "<p style={margin-bottom: 8}>선택한 영역은 계속 유지됩니다.</p>" + "<span style='color:#DDDDDD; font-size: 15'>*영상의 크기를 조절하면 영역이 초기화 됩니다.</span>",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "영역 캡쳐",
      denyButtonText: "초기화",
      heightAuto: false,
    }).then((result) => {
      if (result.isDenied) {
        setShowSelectAreaCanvas(false);
      } else if (result.isConfirmed) {
        setCaptureSelectArea(true)
        setShowSelectAreaCanvas(false)
      } else {
        setShowSelectAreaCanvas(false)
      }
    });
  };

  return (
    <div id="toast-container">
      <EditorComponent setIsCapturingOneClick={setIsCapturingOneClick} capturedImageUrl={capturedImageUrl}/>
      {/*<button className="btn btn-success btn" onClick={HandleClick}>
        button
      </button>
      <button onClick={captureOneClick}> FullCapture </button>*/}
    </div>
  );
};

export default VideoDocumentEditor;
