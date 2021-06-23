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
        <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`}>
          <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
        </button>
        <button className={`${styles[`video-document-editor-capture-btn`]} btn btn-primary`} onClick={insertImage}>
          <img className={`${styles[`video-document-editor-capture-icon`]}`} src={captureImg} alt="captureImage" />
        </button>
        <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`}>
          <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
        </button>
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
