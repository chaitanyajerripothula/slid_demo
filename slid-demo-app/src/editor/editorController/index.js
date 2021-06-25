import React, { useState } from "react";
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
  const { componentRef } = props;
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState("");

  props.setEditorFontSize(fontSize);

  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const insertImage = () => {
    props.insertImage();
  };

  const openEditorSetting = () => {
    setOpen(!open);
  };

  const onClickRecordVideoBtn = () => {
    Swal.fire({
      target: document.getElementById("custom-target"),
      title: "준비중입니다!",
      text: "영상을 짧게 녹화할 수 있는 기능이 현재 준비 중입니다!\n슬리드의 업데이트들을 기대해 주세요. :)",
      customClass: 'position-absolute',
      position: "bottom-left",
      confirmButtonText: "확인",
      icon: "info",
      confirmButtonColor: "#2778c4",
    });
  };

  return (
    <div className={`${styles[`container`]}`}>
      {open ? <EditorSetting setFontSize={setFontSize} /> : null}
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
        <OverlayTrigger
          defaultShow={false}
          placement={"top"}
          overlay={
            <Tooltip>
              <div>영역 지정</div>
            </Tooltip>
          }
        >
          <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`}>
            <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
          </button>
        </OverlayTrigger>
        <OverlayTrigger
          defaultShow={false}
          placement={"top"}
          overlay={
            <Tooltip>
              <div>
                원클릭 캡쳐
                <br /> Cmd + /
              </div>
            </Tooltip>
          }
        >
          <button className={`${styles[`video-document-editor-capture-btn`]} btn btn-primary`} onClick={insertImage}>
            <img className={`${styles[`video-document-editor-capture-icon`]}`} src={captureImg} alt="captureImage" />
          </button>
        </OverlayTrigger>
        <OverlayTrigger
          defaultShow={false}
          placement={"top"}
          overlay={
            <Tooltip>
              <div>클립 녹화</div>
            </Tooltip>
          }
        >
          <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickRecordVideoBtn}>
            <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
          </button>
        </OverlayTrigger>
      </div>
      <div className={`${styles[`video-document-editor-right-wrapper`]}`}>
        <div className={`${styles[`video-document-editor-save-container`]}`}>
          <img className={`${styles[`video-document-editor-save-icon`]}`} src={saveImg} alt="saveImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>{props.isSave ? "저장완료" : "자동 저장 중..."}</span>
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
