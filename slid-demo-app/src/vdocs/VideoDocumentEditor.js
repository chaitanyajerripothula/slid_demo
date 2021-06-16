import React, { useRef, useState } from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = () => {
  const canvasRef = useRef();

  const imageCapture = (props) => {
    let w, h, ratio;

    ratio = props.videoRef.width / props.videoRef.height;
    w = props.videoRef.current.width - 400;
    h = parseInt(w / ratio, 10);

    canvasRef.current.width = w;
    canvasRef.current.height = h;

    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(props.videoRef.current, 0, 0, w, h)
  }

  return (
    <div>
      <canvas ref={canvasRef}/>
      <button onClick={imageCapture}> Capture </button>
    </div>
  );
};

export default VideoDocumentEditor;
