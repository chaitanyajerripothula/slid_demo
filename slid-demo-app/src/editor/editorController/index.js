import React, { useCallback, useEffect, useState } from "react";
import styles from "./editorController.module.css";
import undoImg from "../../design/assets/slid_backward_icon.png";
import redoImg from "../../design/assets/slid_forward_icon.png";
import settingImg from "../../design/assets/slid_setting_icon.png";
import saveImg from "../../design/assets/slid_double_check_icon.png";
import downloadImg from "../../design/assets/slid_download_icon.png";
import captureImg from "../../design/assets/slid_capture_icon.png";
import areaCaptureImg from "../../design/assets/slid_set_area_icon.png";
import recordingImg from "../../design/assets/slid_recording_gray_icon.png";
import { useReactToPrint } from "react-to-print";
import EditorSetting from "../editorSetting";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";

const EditorController = (props) => {
  const { componentRef, isSaving, editorWidth, lang, isMacOs } = props;
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState("small");

  useEffect(() => {
    props.handleSetFontSize(fontSize);
  }, [fontSize]);

  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const insertImage = useCallback(() => {
    props.handleInsertImage();
  }, []);

  const openEditorSetting = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onClickRecordVideoBtn = () => {
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "준비중입니다!",
      html: `<p>영상을 짧게 녹화할 수 있는 기능이 현재 준비 중입니다!</p><p>슬리드의 업데이트들을 기대해 주세요. :)</p>`,
      position: "center",
      confirmButtonText: "확인",
      icon: "info",
      confirmButtonColor: "#2778c4",
      heightAuto: false,
    }).then(() => {});
  };

  return (
    <div className={`${styles[`container`]}`}>
      {open ? <EditorSetting setFontSize={setFontSize} fontSize={fontSize} /> : null}
      {editorWidth > 400 ? null : (
        <div className={`${styles[`video-document-editor-setting-popup`]}`}>
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "영역 지정" : "Set capture area"}</Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`}>
              <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
            </button>
          </OverlayTrigger>
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "클립 녹화" : "Clip recording"} </Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickRecordVideoBtn}>
              <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
            </button>
          </OverlayTrigger>
        </div>
      )}
      <div className={`${styles[`video-document-editor-left-wrapper`]}`}>
        <div className={`${styles[`video-document-editor-undo-redo-container`]}`}>
          <img
            className={`${styles[`video-document-editor-control-icon`]}`}
            src={undoImg}
            alt="undo"
            onClick={() => {
              props.undoEditor();
            }}
          />
          <img
            className={`${styles[`video-document-editor-control-icon`]}`}
            src={redoImg}
            alt="redo"
            onClick={() => {
              props.redoEditor();
            }}
          />
        </div>
        <div className={`${styles[`video-document-editor-setting-container`]}`} onClick={openEditorSetting}>
          <img className={`${styles[`video-document-editor-setting-icon`]}`} src={settingImg} alt="settingImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>Editor Setting</span>
        </div>
      </div>
      <div className={`${styles[`video-document-editor-center-wrapper`]}`}>
        {editorWidth > 400 ? (
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "영역 지정" : "Set capture area"}</Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`}>
              <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
            </button>
          </OverlayTrigger>
        ) : null}
        <OverlayTrigger
          defaultShow={false}
          placement={"top"}
          overlay={
            <Tooltip>
              {lang === "ko-KR" ? (
                <div>
                  원클릭 캡쳐 <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                </div>
              ) : (
                <div>
                  Screenshot <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                </div>
              )}
            </Tooltip>
          }
        >
          <button className={`${styles[`video-document-editor-capture-btn`]} btn btn-primary`} onClick={insertImage}>
            <img className={`${styles[`video-document-editor-capture-icon`]}`} src={captureImg} alt="captureImage" />
          </button>
        </OverlayTrigger>
        {editorWidth > 400 ? (
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "클립 녹화" : "Clip recording"} </Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickRecordVideoBtn}>
              <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
            </button>
          </OverlayTrigger>
        ) : null}
      </div>
      <div className={`${styles[`video-document-editor-right-wrapper`]}`}>
        <div className={`${styles[`video-document-editor-save-container`]}`}>
          <img className={`${styles[`video-document-editor-save-icon`]}`} src={saveImg} alt="saveImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>{isSaving ?(lang === "ko-KR" ? "저장 완료" : "Auto Saved") : lang === "ko-KR" ? "자동 저장 중..." : "Saving..."}</span>
        </div>
        <div className={`${styles[`video-document-editor-download-container`]}`} onClick={renderPdfPrint}>
          <img className={`${styles[`video-document-editor-download-icon`]}`} src={downloadImg} alt="downloadImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>Download</span>
        </div>
      </div>
    </div>
  );
};

export default EditorController;
