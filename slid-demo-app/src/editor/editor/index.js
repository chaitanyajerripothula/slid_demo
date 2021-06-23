import React from "react";
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
      undoInstance: this.setUndoRedoInstance,
      fontSize: "small",
      save: true,
    };
  }

  setUndoRedoInstance = () => {
    const editor = this.editorInstance;
    this.undoInstance = new Undo({ editor });
  };

  onChangeEditor = () => {
    console.log(`내용 변경 중!`);
    this.setState({ save: false });
  };

  insertImage = () => {
    this.editorInstance.blocks.insert("image", { url: testImg }, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
  };

  setFontSize = (size) => {
    this.setState({ fontSize: size });
  };

  render() {
    let { fontSize, save } = this.state;

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
        <div className={`${styles[`container`]}`}>
          <input className={`${styles[`input-title`]} ${styles[`font-${fontSize}`]}`} type="text" onChange={onChangeTitle} placeholder="제목을 입력하세요" autoComplete="false" autoFocus={true} />
          <div className={`${styles[`editor-container`]} ${styles[`font-${fontSize}`]}`} ref={this.componentRef}>
            <EditorJs tools={EDITOR_JS_TOOLS} initialBlock={"paragraph"} onReady={this.setUndoRedoInstance} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
          </div>
        </div>
        <EditorController
          insertImage={this.insertImage}
          componentRef={this.componentRef}
          setEditorFontSize={this.setFontSize}
          undoEditor={() => this.undoInstance.undo()}
          redoEditor={() => this.undoInstance.redo()}
          save={save}
        />
      </div>
    );
  }
}

export default Editor;
