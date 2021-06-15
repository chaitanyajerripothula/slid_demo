import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import SimpleImage from "./utils/tools/blocks/simpleImage";

class Editor extends React.PureComponent {
  async handleSave() {
    const saveData = await this.editorInstance.save();
  }

  onChangeEditor() {
    console.log("내용이 변경됨!");
  }

  uploadImg = () => {
    //const url = "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg";
    //this.editorInstance.blocks.insert(this.SimpleImage,url,true,this.editorInstance.blocks.getCurrentBlockIndex()+1,false)
    console.log("upload!");
  };

  render() {
    return (
      <div className={styles.container}>
        <input className={styles.input_title} type="text" placeholder="제목을 입력하세요" autoComplete="false" />
        <EditorJs tools={EDITOR_JS_TOOLS} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
        <button onClick={this.uploadImg}>upload</button>
      </div>
    );
  }
}

export default Editor;
