import React, { useState } from "react";
import styles from "./editorController.module.css";
import undoImg from "../../design/assets/slid_backward_icon.png";
import redoImg from "../../design/assets/slid_forward_icon.png";
import settingImg from "../../design/assets/slid_setting_icon.png";
import saveImg from "../../design/assets/slid_double_check_icon.png";
import downloadImg from "../../design/assets/slid_download_icon.png";
import captureImg from "../../design/assets/slid_capture_icon.png";
import { useReactToPrint } from "react-to-print";
import EditorSetting from "../editorSetting";

const EditorController = (props) => {
  const { componentRef } = props;

  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState("");

  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const insertImage = () => {
    props.insertImage();
  };

  const openEditorSetting = () => {
    setOpen(!open);
  };

  props.setEditorFontSize(fontSize);

  return (
    <div className={styles.container}>
      {open ? <EditorSetting setFontSize={setFontSize} /> : null}
      <div className={styles.video_document_editor_left_wrapper}>
        <div className={styles.video_document_editor_undo_redo_container}>
          <img
            className={styles.video_document_editor_control_icon}
            src={undoImg}
            alt="undo"
            onClick={() => {
              props.undoEditor();
            }}
          />
          <img
            className={styles.video_document_editor_control_icon}
            src={redoImg}
            alt="redo"
            onClick={() => {
              props.redoEditor();
            }}
          />
        </div>
        <div className={styles.video_document_editor_setting_container} onClick={openEditorSetting}>
          <img className={styles.video_document_editor_setting_icon} src={settingImg} alt="settingImage" />
          <span className={styles.video_document_editor_text}>Editor Setting</span>
        </div>
      </div>
      <div className={styles.video_document_editor_center_wrapper}>
        <button>1</button>
        <button className={styles.video_document_editor_capture_btn} onClick={insertImage}>
          <img className={styles.video_document_editor_capture_icon} src={captureImg} alt="captureImage" />
        </button>
        <button>3</button>
      </div>
      <div className={styles.video_document_editor_right_wrapper}>
        <div className={styles.video_document_editor_save_container}>
          <img className={styles.video_document_editor_save_icon} src={saveImg} alt="saveImage" />
          <span className={styles.video_document_editor_text}>{props.save ? "저장완료" : "자동 저장 중..."}</span>
        </div>
        <div className={styles.video_document_editor_download_container} onClick={renderPdfPrint}>
          <img className={styles.video_document_editor_download_icon} src={downloadImg} alt="downloadImage" />
          <span className={styles.video_document_editor_text}>Download</span>
        </div>
      </div>
    </div>
  );
};

export default EditorController;
