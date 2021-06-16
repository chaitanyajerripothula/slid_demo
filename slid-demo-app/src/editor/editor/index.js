import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import testImg from "./utils/tools/blocks/simpleImage/img_test.png";
import EditorController from "../editorController";

class Editor extends React.PureComponent {
  onChangeEditor() {
    console.log("내용이 변경됨!");
  }

  insertImage = () => {
    this.editorInstance.blocks.insert("image", { url: testImg }, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
    console.log("upload!");
  };

  render() {
    return (
      <div>
        <div className={styles.container}>
          <input className={styles.input_title} type="text" placeholder="제목을 입력하세요" autoComplete="false" />
          <EditorJs tools={EDITOR_JS_TOOLS} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
        </div>
        <EditorController insertImage={this.insertImage} />
      </div>
    );
  }
}

export default Editor;
