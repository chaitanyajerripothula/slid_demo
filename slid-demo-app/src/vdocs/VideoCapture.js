import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import styles from "./VideoCapture.module.css";

const VideoCapture = (props) => {
  const { showSelectAreaCanvas, videoPlayerRef, videoPlaceholderRef, isCapturingOneClick, setIsCapturingOneClick } = props;

  const [squareCoordinate, setSquareCoordinate] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  const canvas = useRef();
  const canvasRef = useRef();

  useEffect(()=>{
    let w, h, ratio;

    ratio = videoPlaceholderRef.current.offsetWidth / videoPlaceholderRef.current.offsetHeight;
    h = 375;
    w = parseInt(h * ratio, 10);
    //w = 630;

    setSquareCoordinate(0, 0, w, h);
  }, []);

  // 영상 전체 캡처
  useEffect(() => {
    if(isCapturingOneClick) {
      console.log("냐옹");

      const capturingCanvas = document.createElement("canvas");
      capturingCanvas.width = videoPlaceholderRef.current.offsetWidth;
      capturingCanvas.height = videoPlaceholderRef.current.offsetHeight;

      const ctx = capturingCanvas.getContext('2d');
      //ctx.fillRect(0, 0, w, h);
      ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), squareCoordinate.left, squareCoordinate.top, squareCoordinate.width, squareCoordinate.height);

      const imageUrl = capturingCanvas.toDataURL();
      console.log(imageUrl);
      
      // //const frame = captureVideoFrame(this.player.getInternalPlayer())
      // //let imageURL = frame.dataUri

      setIsCapturingOneClick(false);
    }
  }, [isCapturingOneClick]);

  // 영역 지정 캡처
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
      console.log(`square.left: ${square.left}, x: ${x}, mouse.x: ${mouse.x}, square.top: ${square.top}, y: ${y}, mouse.y: ${mouse.y}`);
      console.log(`width: ${w}, height: ${h}`);
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
      console.log(square);

      // imageCapture(square);
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
