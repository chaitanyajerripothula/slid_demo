import React from "react";
import EditorComponent from "../editor/EditorComponent";
import Swal from "sweetalert2";
import "./VideoDocumentEditor.css";

const VideoDocumentEditor = (props) => {
  const { show, handleClose, handleShow } = props;

  const HandleClick = () => {
    handleShow();
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "Are you sure?",
      text: "User will have Admin Privileges",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isDenied) {
        handleClose();
      } else if (result.isConfirmed) {
        handleClose();
      }
    });
    console.log(document.getElementById("test"));
    console.log(Swal.getContainer);
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
