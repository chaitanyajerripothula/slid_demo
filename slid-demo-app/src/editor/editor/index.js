import React, { useState } from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import testImg from "./utils/tools/blocks/simpleImage/img_test.png";
import EditorController from "../editorController";
import Undo from "./utils/tools/undo";

class Editor extends React.PureComponent {
  componentRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      undoInstance: null,
    };
  }

  onChangeEditor = () => {
    console.log(`내용 변경 중!`);
  };

  insertImage = () => {
    this.editorInstance.blocks.insert("image", { url: testImg }, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
  };

  render() {
    let { undoInstance } = this.state;
    const setUndoRedoInstance = () => {
      const editor = this.editorInstance;
      console.log(editor);
      undoInstance = new Undo({ editor });
      console.log(`this.state : ${undoInstance}`);
    };

    document.title = "제목 없음";

    const onChangeTitle = (e) => {
      if (e.target.value) {
        document.title = e.target.value;
      } else {
        document.title = "제목 없음";
      }
    };

    return (
      <div>
        <div className={styles.container}>
          <input className={styles.input_title} type="text" onCha nge={onChangeTitle} placeholder="제목을 입력하세요" autoComplete="false" autoFocus={true} />
          <EditorJs ref={this.componentRef} tools={EDITOR_JS_TOOLS} onReady={setUndoRedoInstance} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
        </div>
        <EditorController insertImage={this.insertImage} componentRef={this.componentRef} undoEditor={() => undoInstance.undo()} redoEditor={() => undoInstance.redo()} />
      </div>
    );
  }
}

export default Editor;
