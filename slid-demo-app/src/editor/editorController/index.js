import React from "react";
import editorController from "./editorController.module.css";

const EditorController = () => {
  return (
    <div className={editorController.container}>
      <div className={editorController.video_document_editor_left_wrapper}>
        <div className={editorController.video_document_editor_undo_redo_container}>
          <button>undo</button>
          <button>redo</button>
        </div>
        <div className={editorController.video_document_editor_setting_container}>
          <img alt="settingImage"/>
          <label>Editor Setting</label>
        </div>
      </div>
      <div className={editorController.video_document_editor_center_wrapper}>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>

      <div className={editorController.video_document_editor_right_wrapper}>
        <div className={editorController.video_document_editor_save_container}>
          <img alt="saveImage"/>
          <label>저장 완료</label>
        </div>
        <div className={editorController.video_document_editor_download_container}>
          <img alt="downloadImage"/>
          <label>Download</label>
        </div>
      </div>
    </div>
  );
};

export default EditorController;
