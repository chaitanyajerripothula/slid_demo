import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import styles from "./VideoCapture.module.css";

const VideoCapture = (props) => {
  const { selectAreaCoordinate, setSelectAreaCoordinate, setCaptureImgUrl, showSelectAreaCanvas, videoPlayerRef, videoPlaceholderRef, isCapturingOneClick, setIsCapturingOneClick } = props;
  const canvasRef = useRef();

  // useEffect(()=>{
  //   let w, h, ratio;

  //   //ratio = videoPlaceholderRef.current.offsetWidth / videoPlaceholderRef.current.offsetHeight;
  //   //h = 375;
  //   //w = parseInt(h * ratio, 10);
  //   w = videoPlaceholderRef.current.offsetWidth;
  //   h = videoPlaceholderRef.current.offsetHeight;

  //   setselectAreaCoordinate({
  //     ...selectAreaCoordinate,
  //     left: 0,
  //     top: 0,
  //     width: w,
  //     height: h
  //   });
  // }, []);

  // 영상 캡처
  useEffect(() => {
    if (isCapturingOneClick) {
      imageCapture();
      setIsCapturingOneClick(false);

      console.log("setImageUrl");

      // //const frame = captureVideoFrame(this.player.getInternalPlayer())
      // //let imageURL = frame.dataUri
    }
  }, [isCapturingOneClick]);

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

    let square;
    if (selectAreaCoordinate.width === "" && selectAreaCoordinate.height === "") {
      console.log("no selectAreaCoordinate");
      console.log(`height: ${videoPlaceholderRef.current.offsetHeight} left: ${videoPlaceholderRef.current.left}`);
      square = new fabric.Rect({
        left: 0,
        top: 0,
        width: videoPlaceholderRef.current.offsetWidth - 3,
        height: videoPlaceholderRef.current.offsetHeight - 3,
        fill: "rgb(255, 255, 255, 0.2)",
        stroke: "blue",
        opacity: 1,
        strokeWidth: 3,
        strokeDashArray: [5, 5],
      });

      setSelectAreaCoordinate({
        left: square.left,
        top: square.top,
        width: square.width,
        height: square.height,
      });
    } else {
      console.log("yes selectAreaCoordinate");
      square = new fabric.Rect({
        left: selectAreaCoordinate.left,
        top: selectAreaCoordinate.top,
        width: selectAreaCoordinate.width,
        height: selectAreaCoordinate.height,
        fill: "rgb(255, 255, 255, 0.2)",
        stroke: "blue",
        opacity: 1,
        strokeWidth: 3,
        strokeDashArray: [5, 5],
      });
    }

    canvasRef.current.add(square);

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

  const imageCapture = () => {
    console.log("imageCapture");
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
    captureImageCanvas.width = selectAreaCoordinate.width;
    captureImageCanvas.height = selectAreaCoordinate.height;

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

    setCaptureImgUrl(captureImageCanvas.toDataURL());
  };

  const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
      canvas.remove(o);
      // if (o !== canvas.backgroundImage) {
      //   canvas.remove(o);
      // }
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
