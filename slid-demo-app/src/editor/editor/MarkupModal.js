import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "./editor.module.css";
import { fabric } from "fabric";
import Swal from "sweetalert2";
import CircleExample from "./CircleExample";
import SweetAlert from "react-bootstrap-sweetalert";
import Editor from ".";
import "./editor.css";

const MarkupModal = (props) => {
  const { markupModalOpen, markupImgUrl, handleSaveMarkupImage } = props;
  const markupCanvasRef = useRef();
  const [markupCanvas, setMarkupCanvas] = useState();
  const [penWidth, setPenWidth] = useState(5);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [highlightColorPicker, setHighlightColorPicker] = useState(false);
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [penWidthState, setPenWidthState] = useState("small");
  const [cursorState, setCursorState] = useState("pen");

  const [isRedoing, setIsRedoing] = useState(false);
  let h = [];

  const undo = () => {
    if (markupCanvasRef.current._objects.length > 0) {
      h.push(markupCanvasRef.current._objects.pop());
      markupCanvasRef.current.renderAll();
    }
  };

  const redo = () => {
    if (h.length > 0) {
      setIsRedoing(true);
      markupCanvasRef.current.add(h.pop());
    }
  };

  // useEffect(() => {
  //   console.log(isRedoing);
  //   console.log(markupCanvasRef.current._objects);
  // }, [isRedoing]);

  useEffect(() => {
    if (markupModalOpen) {
      // var markupImg = new Image();
      // markupImg.src = markupImgUrl;

      // let w, h;
      // w = markupCanvasRef.current.width;
      // h = markupCanvasRef.current.height;

      // const tmpCanvas = document.createElement("canvas");

      // let ctx = tmpCanvas.getContext("2d");
      // ctx.drawImage(markupImg, 0, 0, w, h);

      // let tmpUrl = tmpCanvas.toDataURL();

      markupCanvasRef.current = new fabric.Canvas("markup-canvas", {
        backgroundImage: markupImgUrl,
        isDrawingMode: true,
        freeDrawingCursor: "url(../../../design/assets/slid_pen_cursor.png) 0 0, auto",
      });

      markupCanvasRef.current.on("object:added", () => {
        if (!isRedoing) {
          h = [];
        }
        setIsRedoing(false);
      });

      markupCanvasRef.current.freeDrawingBrush.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      markupCanvasRef.current.freeDrawingBrush.width = penWidth;

      // setMarkupCanvas(initCanvas());
      fabric.Object.prototype.transparentCorners = false;
    }
  }, [markupModalOpen]);

  useEffect(() => {
    console.log(color);
    console.log(penWidth);
    if (markupCanvasRef.current !== undefined) {
      // markupCanvasRef.current.freeDrawingBrush.width = penWidth;
      if (cursorState === "highlighter") {
        markupCanvasRef.current.freeDrawingBrush.width = penWidth * 3;
      } else {
        markupCanvasRef.current.freeDrawingBrush.width = penWidth;
      }
      markupCanvasRef.current.freeDrawingBrush.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
  }, [color, penWidth]);

  const initCanvas = () => {
    // new fabric.Canvas("markup-canvas", {
    //   backgroundImage: markupImgUrl,
    //   isDrawingMode: true,
    // });
    // const cursorImage = new fabric.Image.fromURL("../../../design/assets/slid_cursor_icon.png", (image) => {
    //   markupCanvasRef.current.add(cursorImage);
    //   markupCanvasRef.current.renderAll();
    // });
  };

  useEffect(() => {
    console.log(highlightColorPicker);
  }, [highlightColorPicker]);

  const cursorClick = () => {
    console.log("cursorClick");
    setCursorState("cursor");
    markupCanvasRef.current.isDrawingMode = false;
    // markupCanvasRef.current.freeDrawingCursor = "url(../../../design/assets/slid_cursor_icon.png) 0 0, auto";
    markupCanvasRef.current.defaultCursor = "url(../../../design/assets/slid_select_cursor.png) 0 0, auto";
  };

  const penClick = () => {
    console.log("penClick");
    setCursorState("pen");
    markupCanvasRef.current.isDrawingMode = true;
    markupCanvasRef.current.freeDrawingCursor = "url(../../../design/assets/slid_pen_cursor.png) 0 0, auto";
    setHighlightColorPicker(false);
    setColor({
      ...color,
      a: 1,
    });
  };

  const highlightingClick = () => {
    console.log("highlightingClick");
    setCursorState("highlighter");
    console.log(markupCanvasRef.current.freeDrawingBrush.width);
    setHighlightColorPicker(true);
    markupCanvasRef.current.isDrawingMode = true;
    setColor({
      ...color,
      a: 0.3,
    });
    markupCanvasRef.current.freeDrawingCursor = "url(../../../design/assets/slid_highlighter_cursor.png) 0 0, auto";
  };

  const textBtnClick = () => {
    setHighlightColorPicker(false);
    setColor({
      ...color,
      a: 1,
    });
    const text = new fabric.Textbox("텍스트 입력", { left: 5, top: 5, fontSize: 20, fill: `rgba(${color.r}, ${color.g}, ${color.b})` });
    markupCanvasRef.current.add(text);
    markupCanvasRef.current.setActiveObject(text);
    markupCanvasRef.current.renderAll();

    cursorClick();
  };

  const deleteModal = () => {
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "정말 삭제하시겠습니까?",
      html: `<p>해당 이미지의 모든 필기가 삭제됩니다.</p><p>삭제된 필기는 복구할 수 없습니다.</p>`,
      icon: "warning",
      position: "center",
      heightAuto: false,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCanvas();
      }
    });
  };

  const clearCanvas = () => {
    markupCanvasRef.current.getObjects().forEach((o) => {
      if (o !== markupCanvasRef.current.backgroundImage) {
        markupCanvasRef.current.remove(o);
      }
    });
  };

  return (
    <div>
      {markupModalOpen ? (
        <div className={styles[`modal`]}>
          <div className={styles[`markup-container`]}>
            <div className={styles[`markup-tool-container`]}>
              <div className={styles[`markup-type-container`]}>
                <div className={`btn-group`} role="group">
                  <button type="button" className={`btn btn-light ` + (cursorState === "cursor" ? "active" : "")}>
                    <img className={styles[`markup-type-image`]} onClick={cursorClick} alt={"slid cursor icon"} src={"../../../design/assets/slid_cursor_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light ` + (cursorState === "pen" ? "active" : "")}>
                    <img className={styles[`markup-type-image`]} onClick={penClick} alt={"slid pen icon"} src={"../../../design/assets/slid_pen_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light ` + (cursorState === "highlighter" ? "active" : "")} onClick={highlightingClick}>
                    <img className={styles[`markup-type-image`]} alt={"slid highlighter icon"} src={"../../../design/assets/slid_highlighter_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light`} onClick={textBtnClick}>
                    <img className={styles[`markup-type-image`]} alt={"slid text icon"} src={"../../../design/assets/slid_text_icon.png"} />
                  </button>
                </div>
              </div>
              |
              <div className={styles[`color-picker-container`]}>
                <div className={`btn-group`} role="group">
                  <CircleExample highlightColorPicker={highlightColorPicker} displayColorPicker={displayColorPicker} setDisplayColorPicker={setDisplayColorPicker} color={color} setColor={setColor} />
                </div>
              </div>
              |
              <div className={styles[`size-picker-container`]}>
                <div className={`btn-group`} role="group">
                  <button
                    type="button"
                    onClick={() => {
                      setPenWidth(5);
                      setPenWidthState("small");
                    }}
                    className={(penWidthState === "small" ? "active" : "") + ` btn btn-light`}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#000000",
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPenWidth(10);
                      setPenWidthState("medium");
                    }}
                    className={`btn btn-light ` + (penWidthState === "medium" ? "active" : "")}
                    id="btn2"
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "#000000",
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPenWidth(15);
                      setPenWidthState("large");
                    }}
                    className={`btn btn-light ` + (penWidthState === "large" ? "active" : "")}
                    id="btn3"
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#000000",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
              className={styles[`canvas-container`]}
            >
              <canvas id="markup-canvas" className={styles[`markup-canvas`]} ref={markupCanvasRef}></canvas>
            </div>
            <div className={styles[`markup-control-container`]}>
              <div className={styles[`history-container`]}>
                <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`} onClick={undo}>
                  <img className={`markup-type-img`} alt={"backward button"} src={"../../../design/assets/slid_backward_icon.png"} />
                </button>
                <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`} onClick={redo}>
                  <img className={`markup-type-img`} alt={"forward button"} src={"../../../design/assets/slid_forward_icon.png"} />
                </button>
                <button type="button" onClick={deleteModal} className={`${styles[`markup-control-btn`]} btn btn-light`}>
                  <img className={`markup-type-img`} alt={"reset button"} src={"../../../design/assets/slid_trash_icon.png"} />
                </button>
              </div>
              <div className={styles[`close-container`]}>
                <button type="button" className={`${styles[`markup-save-btn`]} btn btn-primary`} onClick={handleSaveMarkupImage}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MarkupModal;
