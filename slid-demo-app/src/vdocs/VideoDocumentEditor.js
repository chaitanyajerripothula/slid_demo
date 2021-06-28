import React from "react";
import EditorComponent from "../editor/EditorComponent";
import Swal from "sweetalert2";
import "./VideoDocumentEditor.css";

const VideoDocumentEditor = (props) => {
  const { show, handleClose, handleShow, handleCaptureOn } = props;

  const HandleClick = () => {
    handleShow();
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "👈 캡쳐할 영역을 선택해주세요.",
      html: "<p style='margin-bottom: 8'>선택한 영역은 계속 유지됩니다.</p>" + "<span style='color:#DDDDDD; font-size: 15'>*영상의 크기를 조절하면 영역이 초기화 됩니다.</span>",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "영역 캡쳐",
      denyButtonText: "초기화",
      heightAuto: false,
    }).then((result) => {
      if (result.isDenied) {
        handleClose();
      } else if (result.isConfirmed) {
        handleCaptureOn();
        handleClose();
      } else {
        handleClose();
      }
    });
  };

  return (
    <div id="toast-container">
      <EditorComponent />
      <button class="btn btn-success btn" onClick={HandleClick}>
        button
      </button>
      <div id="test"></div>
    </div>
  );
};

export default VideoDocumentEditor;
