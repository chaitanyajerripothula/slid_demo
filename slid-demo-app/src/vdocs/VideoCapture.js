import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import styles from "./VideoCapture.module.css";

const VideoCapture = (props) => {
  const { showSelectAreaCanvas, videoPlayerRef, videoPlaceholderRef, isCapturingFullScreen, setIsCapturingFullScreen } = props;

  const [selectAreaCoordinate, setSelectAreaCoordinate] = useState({
    left: "",
    top: "",
    width: "",
    height: "",
  });

  const canvas = useRef();
  const canvasRef = useRef();

  // 영상 전체 캡처
  useEffect(() => {
    if (isCapturingFullScreen) {
      let w, h, ratio;

      ratio = videoPlayerRef.current.getInternalPlayer().videoWidth / videoPlayerRef.current.getInternalPlayer().videoHeight;

      h = 300;
      w = parseInt(h * ratio, 10);

      canvas.current.width = w;
      canvas.current.height = h;

      const ctx = canvas.current.getContext("2d");
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h);

      //const frame = captureVideoFrame(this.player.getInternalPlayer())
      //let imageURL = frame.dataUri
      let imageURL = canvas.current.toDataURL();
      console.log(imageURL);

      setIsCapturingFullScreen(false);
    }
  }, [isCapturingFullScreen]);

  // 영역 지정 캡처 화면 생성
  useEffect(() => {
    canvasRef.current = new fabric.Canvas("fabricCanvas", {
      left: videoPlaceholderRef.current.left,
      top: videoPlaceholderRef.current.top,
      width: videoPlaceholderRef.current.offsetWidth,
      height: videoPlaceholderRef.current.offsetHeight,
      backgroundColor: "transparent",
      hoverCursor: "crosshair",
      selection: false,
    });
    createBoundary();
  }, [showSelectAreaCanvas]);

  // 캡쳐 사각형 좌표 저장
  useEffect(() => {
    console.log(selectAreaCoordinate);
  }, [selectAreaCoordinate]);

  // 범위 지정 사각형 생성 함수
  const createBoundary = () => {
    let mousePressed = false;
    let x = 0;
    let y = 0;

    let square = new fabric.Rect({
      width: videoPlaceholderRef.current.offsetWidth - 3,
      height: videoPlaceholderRef.current.offsetHeight - 3,
      fill: "rgb(255, 255, 255, 0.2)",
      stroke: "blue",
      opacity: 1,
      strokeWidth: 3,
      strokeDashArray: [5, 5],
    });

    canvasRef.current.add(square);
    // canvas.renderAll();

    canvasRef.current.on("mouse:down", (event) => {
      clearCanvas(canvasRef.current);
      const mouse = canvasRef.current.getPointer(event.e);
      mousePressed = true;
      x = mouse.x;
      y = mouse.y;

      square = new fabric.Rect({
        width: mouse.x - x,
        height: mouse.y - y,
        left: x,
        top: y,
        originX: "left",
        originY: "top",
        fill: "rgb(255, 255, 255, 0.2)",
        stroke: "blue",
        strokeWidth: 3,
        strokeDashArray: [5, 5],
        angle: 0,
        transparentCorners: false,
        selectable: false,
      });
      canvasRef.current.add(square);
    });

    canvasRef.current.on("mouse:move", (event) => {
      if (!mousePressed) {
        return;
      }

      const mouse = canvasRef.current.getPointer(event.e);
      console.log(`x: ${mouse.x}, y: ${mouse.y}`);

      if (mouse.x > videoPlaceholderRef.current.offsetWidth) {
        mouse.x = videoPlaceholderRef.current.offsetWidth;
      }
      if (mouse.y > videoPlaceholderRef.current.offsetHeight) {
        mouse.y = videoPlaceholderRef.current.offsetHeight;
      }
      if (mouse.x < 0) {
        mouse.x = 0;
      }
      if (mouse.y < 0) {
        mouse.y = 0;
      }

      let w = Math.abs(mouse.x - x),
        h = Math.abs(mouse.y - y);

      if (!w || !h) {
        return false;
      }
      if (mouse.x < x) {
        square.set("left", Math.abs(mouse.x));
      }
      if (mouse.y < y) {
        square.set("top", Math.abs(mouse.y));
      }

      square.set("width", w).set("height", h);

      canvasRef.current.renderAll();
    });

    canvasRef.current.on("mouse:up", (event) => {
      if (mousePressed) {
        mousePressed = false;
      }
      setSelectAreaCoordinate({
        left: square.left,
        top: square.top,
        width: square.width,
        height: square.height,
      });
    });
  };

  const imageCapture = (square) => {
    let w, h;
    const videoImageCanvas = document.createElement("canvas");

    w = videoPlaceholderRef.current.offsetWidth;
    h = videoPlaceholderRef.current.offsetHeight;

    videoImageCanvas.width = w;
    videoImageCanvas.height = h;

    let ctx = videoImageCanvas.getContext("2d");
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h);

    const captureImageCanvas = document.createElement("canvas");
    captureImageCanvas.width = videoPlaceholderRef.current.offsetWidth;
    captureImageCanvas.height = videoPlaceholderRef.current.offsetHeight;

    let newCtx = captureImageCanvas.getContext("2d");
    newCtx.drawImage(
      videoImageCanvas,
      selectAreaCoordinate.left,
      selectAreaCoordinate.top,
      selectAreaCoordinate.width,
      selectAreaCoordinate.height,
      0,
      0,
      captureImageCanvas.width,
      captureImageCanvas.height
    );

    const dataURL = captureImageCanvas.toDataURL();
    console.log(dataURL);
  };

  const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
      if (o !== canvas.backgroundImage) {
        canvas.remove(o);
      }
    });
  };

  return (
    <div>
      {showSelectAreaCanvas ? (
        <span className={styles[`fabric-canvas`]}>
          <canvas id="fabricCanvas" />
        </span>
      ) : null}
    </div>
  );
};

export default VideoCapture;
