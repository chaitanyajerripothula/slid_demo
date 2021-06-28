import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import styles from "./VideoCapture.module.css";

const VideoCapture = (props) => {
  const { show, capture, videoPlayerRef, videoPlaceholderRef } = props;

  const [squareCoordinate, setSquareCoordinate] = useState({
    left: "",
    top: "",
    width: "",
    height: "",
  });

  const canvas = useRef();
  const canvasRef = useRef();

  // 전체 화면 캡처
  const fullImageCapture = () => {
    let w, h, ratio;

    ratio = videoPlayerRef.current.getInternalPlayer().videoWidth / videoPlayerRef.current.getInternalPlayer().videoHeight;
    console.log(ratio);

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
  };

  //영역 지정 캡처
  useEffect(() => {
    canvasRef.current = new fabric.Canvas("canvas", {
      left: videoPlaceholderRef.current.left,
      top: videoPlaceholderRef.current.top,
      width: videoPlaceholderRef.current.offsetWidth,
      height: videoPlaceholderRef.current.offsetHeight,
      backgroundColor: "transparent",
    });
    createBoundary(canvasRef.current);
  }, [show]);

  // 범위 지정 사각형 생성 함수
  const createBoundary = (canvas) => {
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
    canvas.add(square);
    canvas.renderAll();

    canvas.on("mouse:down", (event) => {
      clearCanvas(canvas);
      const mouse = canvas.getPointer(event.e);
      mousePressed = true;
      x = mouse.x;
      y = mouse.y;

      square = new fabric.Rect({
        width: 0,
        height: 0,
        left: x,
        top: y,
        fill: "rgb(255, 255, 255, 0.2)",
        stroke: "blue",
        strokeWidth: 3,
        strokeDashArray: [5, 5],
      });

      canvas.add(square);
      canvas.renderAll();
      canvas.setActiveObject(square);
    });

    canvas.on("mouse:move", (event) => {
      if (!mousePressed) {
        return false;
      }

      const mouse = canvas.getPointer(event.e);

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

      // square = canvas.getActiveObject();
      // square.setCoords("true");
      console.log(`square.left: ${square.left}, x: ${x}, mouse.x: ${mouse.x}, square.top: ${square.top}, y: ${y}, mouse.y: ${mouse.y}`);
      console.log(`width: ${w}, height: ${h}`);
      square.set("width", w).set("height", h).set("scaleX", -1).set("scaleY", -1);
      square.setCoords();
      // if (square.left - mouse.x < 0 && square.top - mouse.y < 0) {
      //   square.set("width", w).set("height", h);
      //   square.setCoords("true");
      // } else if (square.left - mouse.x > 0 && square.top - mouse.y > 0) {
      //   console.log("4사분면");
      //   square.set("width", w).set("height", h).set("scaleX", -1);
      //   square.setCoords("true");
      // }

      canvas.renderAll();
    });

    canvas.on("mouse:up", (event) => {
      if (mousePressed) {
        mousePressed = false;
      }
      square = canvas.getActiveObject();
      console.log(square);

      imageCapture(square);
    });
  };

  const imageCapture = (square) => {
    let w, h;
    const canvas2 = document.createElement("canvas");

    w = videoPlaceholderRef.current.offsetWidth;
    h = videoPlaceholderRef.current.offsetHeight;

    canvas2.width = w;
    canvas2.height = h;

    let ctx = canvas2.getContext("2d");
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h);

    const newCanvas = document.createElement("canvas");
    newCanvas.width = videoPlaceholderRef.current.offsetWidth;
    newCanvas.height = videoPlaceholderRef.current.offsetHeight;

    let newCtx = newCanvas.getContext("2d");
    newCtx.drawImage(canvas2, square.left, square.top, square.width, square.height, 0, 0, newCanvas.width, newCanvas.height);

    const dataURL = newCanvas.toDataURL();
    console.log(dataURL);
  };

  const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
      console.log(o);
      console.log(canvas.getObjects());
      if (o !== canvas.backgroundImage) {
        canvas.remove(o);
      }
    });
  };

  return (
    <div>
      {show ? (
        <span className={styles["fabric-canvas"]}>
          <canvas id="canvas" />
        </span>
      ) : null}
    </div>
  );
};

export default VideoCapture;
