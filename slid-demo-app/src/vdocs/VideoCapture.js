import React, { useRef, useEffect } from "react";
import { fabric } from "fabric";
import styles from "./VideoCapture.module.css";

const VideoCapture = (props) => {
    const { show, videoPlayerRef, videoPlaceholderRef, captureBtnClicked } = props;
    const canvas = useRef();
    const canvasRef = useRef();

    useEffect(() => {
      if(captureBtnClicked) {
        let w, h, ratio;

        ratio = videoPlayerRef.current.getInternalPlayer().videoWidth / videoPlayerRef.current.getInternalPlayer().videoHeight;
        console.log(ratio)
  
        h = 300
        w = parseInt(h * ratio, 10);
  
        canvas.current.width = w;
        canvas.current.height = h;
  
        const ctx = canvas.current.getContext('2d');
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h)
        
        //const frame = captureVideoFrame(this.player.getInternalPlayer())
        //let imageURL = frame.dataUri
        let imageURL = canvas.current.toDataURL();
      }
    }, [captureBtnClicked]);

    //영역 지정 캡처
    useEffect(() => {
        canvasRef.current = new fabric.Canvas('fabricCanvas', {
          width: videoPlaceholderRef.current.offsetWidth,
          height: videoPlaceholderRef.current.offsetHeight,
          backgroundColor: "pink",
        });
        createBoundary(canvasRef.current);
    }, [show]);
    
    const addRect = (canvi) => {
      const rect = new fabric.Rect({
        height: 280,
        width: 200,
        fill: "yellow",
      });
  
      canvi.add(rect);
      canvi.renderAll();
    };
  
    // 범위 지정 사각형 생성 함수
    const createBoundary = (canvas) => {
      let mousePressed = false;
      let x = 0;
      let y = 0;
  
      let square;
  
      canvas.on("mouse:down", (event) => {
        clearCanvas(canvas);
        mousePressed = true;
        console.log(event);
        const mouse = canvas.getPointer(event.e);
        mousePressed = true;
        x = mouse.x;
        y = mouse.y;
  
        square = new fabric.Rect({
          width: 0,
          height: 0,
          left: x,
          top: y,
          fill: "rgb(255, 255, 255, 0)",
          stroke: "blue",
          opacity: 1,
          strokeWidth: 4,
          strokeDashArray: [15, 15]
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
  
        let w = Math.abs(mouse.x - x),
          h = Math.abs(mouse.y - y);
  
        if (!w || !h) {
          return false;
        }
        square = canvas.getActiveObject();
        square.set("width", w).set("height", h);
        canvas.renderAll();
      });
  
      canvas.on("mouse:up", (event) => {
        if (mousePressed) {
          mousePressed = false;
        }
        square = canvas.getActiveObject();
        canvas.add(square);
  
        // imageCapture(square);
  
        canvas.renderAll();
      });
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
                <span className={styles['fabric-canvas']}>
                    <canvas id="fabricCanvas"/>
                </span>
                ) : null}

            {captureBtnClicked ? (<canvas ref={canvas}/>) : null}
        </div>
    );
};

export default VideoCapture;