import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";

class Editor extends React.PureComponent {
  async handleSave() {
    const saveData = await this.editorInstance.save();
  }

  onChangeEditor() {
    console.log("내용이 변경됨!");
  }

  render() {
    return (
      <div className={styles.container}>
        <input className={styles.input_title} type="text" placeholder="제목을 입력하세요" autoComplete="false" />
        <EditorJs tools={EDITOR_JS_TOOLS} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
      </div>
    );
  }
}

export default Editor;
