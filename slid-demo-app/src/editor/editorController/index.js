import React from "react";
import editorController from "./editorController.module.css";
import undoImg from "../../design/assets/slid_backward_icon.png";
import redoImg from "../../design/assets/slid_forward_icon.png";
import settingImg from "../../design/assets/slid_setting_icon.png";
import saveImg from "../../design/assets/slid_double_check_icon.png";
import downloadImg from "../../design/assets/slid_download_icon.png";
import captureImg from "../../design/assets/slid_capture_icon.png";

const EditorController = (props) => {
  const insertTest = () => {
    props.insertImage();
  };

  return (
    <div className={editorController.container}>
      <div className={editorController.video_document_editor_left_wrapper}>
        <div className={editorController.video_document_editor_undo_redo_container}>
          <img className={editorController.video_document_editor_control_icon} src={undoImg} alt="undo" />
          <img className={editorController.video_document_editor_control_icon} src={redoImg} alt="redo" />
        </div>
        <div className={editorController.video_document_editor_setting_container}>
          <img className={editorController.video_document_editor_setting_icon} src={settingImg} alt="settingImage" />
          <span className={editorController.video_document_editor_text}>Editor Setting</span>
        </div>
      </div>
      <div className={editorController.video_document_editor_center_wrapper}>
        <button>1</button>
        <button className={editorController.video_document_editor_capture_btn} onClick={insertTest}>
          <img className={editorController.video_document_editor_capture_icon} src={captureImg} alt="captureImage" />
        </button>
        <button>3</button>
      </div>

      <div className={editorController.video_document_editor_right_wrapper}>
        <div className={editorController.video_document_editor_save_container}>
          <img className={editorController.video_document_editor_save_icon} src={saveImg} alt="saveImage" />
          <span className={editorController.video_document_editor_text}>저장 완료</span>
        </div>
        <div className={editorController.video_document_editor_download_container}>
          <img className={editorController.video_document_editor_download_icon} src={downloadImg} alt="downloadImage" />
          <span className={editorController.video_document_editor_text}>Download</span>
        </div>
      </div>
    </div>
  );
};

export default EditorController;
