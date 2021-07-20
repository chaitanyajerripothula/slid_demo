import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import styles from "./editor.module.css";

const MarkupModal = (props) => {
  const { markupModalOpen, markupImgUrl, handleSaveMarkupImage } = props;
  const markupCanvas = useRef();

  useEffect(() => {
    if (markupModalOpen) {
      var markupImg = new Image();
      markupImg.src = markupImgUrl;

      let w, h;
      w = markupCanvas.current.width;
      h = markupCanvas.current.height;

      let ctx = markupCanvas.current.getContext("2d");
      ctx.drawImage(markupImg, 0, 0, w, h);
    }
  }, [markupModalOpen]);

  return (
    <div>
      {markupModalOpen ? (
        <div className={styles[`modal`]}>
          <div className={styles[`markup-container`]}>
            <div className={styles[`markup-tool-container`]}>
              <div className={styles[`markup-type-container`]}>
                <div className={`btn-group`} role="group">
                  <button type="button" className={`btn btn-light`}>
                    <img className={styles[`markup-type-image`]} alt={"slid cursor icon"} src={"../../../design/assets/slid_cursor_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light`}>
                    <img className={styles[`markup-type-image`]} alt={"slid pen icon"} src={"../../../design/assets/slid_pen_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light`}>
                    <img className={styles[`markup-type-image`]} alt={"slid highlighter icon"} src={"../../../design/assets/slid_highlighter_icon.png"} />
                  </button>
                  <button type="button" className={`btn btn-light`}>
                    <img className={styles[`markup-type-image`]} alt={"slid text icon"} src={"../../../design/assets/slid_text_icon.png"} />
                  </button>
                </div>
              </div>
              |
              <div className={styles[`color-picker-container`]}>
                <div className={`btn-group`} role="group">
                  <button type="button" className={`${styles[`markup-tool-container`]} btn btn-light`}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="circle"
                      className={`${styles[`color-picker-toggle`]}`}
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      color="rgba(0,95,252,1)"
                    >
                      <path className={styles[`color-picker-toggle`]} fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              |
              <div className={styles[`size-picker-container`]}>
                <div className={`btn-group`} role="group">
                  <button type="button" className={`${styles[`size-small`]} btn btn-light`}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="circle"
                      className="svg-inline--fa fa-circle fa-w-16 "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                    </svg>
                  </button>
                  <button type="button" className={`${styles[`size-mideum`]} btn btn-light`}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="circle"
                      className="svg-inline--fa fa-circle fa-w-16 "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                    </svg>
                  </button>
                  <button type="button" className={`${styles["size-large"]} btn btn-light`}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="circle"
                      className="svg-inline--fa fa-circle fa-w-16 "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles[`canvas-container`]}>
              <div className={styles[`canvas`]}>
                <canvas className={styles[`markup-canvas`]} ref={markupCanvas}></canvas>
              </div>
            </div>
            <div className={styles[`markup-control-container`]}>
              <div className={styles[`history-container`]}>
                <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`}>
                  <img className={`markup-type-img`} alt={"backward button"} src={"../../../design/assets/slid_backward_icon.png"} />
                </button>
                <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`}>
                  <img className={`markup-type-img`} alt={"forward button"} src={"../../../design/assets/slid_forward_icon.png"} />
                </button>
                <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`}>
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
