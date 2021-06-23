import React from "react";
import EditorComponent from "../editor/EditorComponent";
import Swal from "sweetalert2";

const VideoDocumentEditor = (props) => {
  const { show, handleClose, handleShow } = props;

  const HandleClick = () => {
    handleShow();
    Swal.fire({
      position: "center",
      title: "Are you sure?",
      text: "User will have Admin Privileges",
      icon: "warning",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      target: document.querySelector("#toast-container"),
    }).then((result) => {
      if (result.isDenied) {
        handleClose();
      } else if (result.isConfirmed) {
        handleClose();
      }
    });

    console.log(Swal.getContainer);
  };

  return (
    <div id="toast-container">
      <EditorComponent />
      <button class="btn btn-success btn" onClick={HandleClick}>
        button
      </button>
      <div
        style={{
          width: 100,
          height: 100,
          backgroundColor: "blue",
        }}
      >
        hi
      </div>
    </div>
  );
};

export default VideoDocumentEditor;
