import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import testImg from "./utils/tools/blocks/simpleImage/img_test.png";
import EditorController from "../editorController";
import Undo from "./utils/tools/undo";

class Editor extends React.PureComponent {
  componentRef = React.createRef();
  isSave = true;

  constructor(props) {
    super(props);
    this.state = {
      undoInstance: this.setUndoRedoInstance,
      fontSize: "medium",
    };
  }

  setUndoRedoInstance = () => {
    const editor = this.editorInstance;
    this.undoInstance = new Undo({ editor });
  };

  onChangeEditor = () => {
    this.isSave = false;
  };

  insertImage = () => {
    this.editorInstance.blocks.insert("image", { url: testImg }, {}, this.editorInstance.blocks.getCurrentBlockIndex()+1, true);
  };

  setFontSize = (size) => {
    this.setState({ fontSize: size ? size : "small" });
  };

  checkEditorBlockCount = () => {
    if (this.editorInstance.blocks.getBlocksCount() === 0) {
      this.editorInstance.blocks.insert(
        "paragraph",
        {
          text: "",
        },
        {},
        this.editorInstance.blocks.getCurrentBlockIndex(),
        true
      );
    }
  };

  render() {
    let { fontSize } = this.state;
    document.title = "제목 없음";

    const onChangeTitle = (e) => {
      if (e.target.value) {
        document.title = e.target.value;
      } else {
        document.title = "제목 없음";
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (!this.editorInstance || !this.editorInstance.blocks) return;
        this.editorInstance.blocks.insert(
          "paragraph",
          {
            text: "",
          },
          {},
          0,
          true
        );
        this.editorInstance.caret.setToFirstBlock();
      }
    };

    return (
      <div>
        <div className={`${styles[`container`]}`}>
          <h1 className={`${styles[`font-${fontSize}`]}`}>
            <input className={`${styles[`input-title`]}`} type="text" onChange={onChangeTitle} placeholder="제목을 입력하세요" autoComplete="false" autoFocus={true} onKeyPress={handleKeyPress} />
          </h1>
          <div className={`${styles[`editor-container`]} ${styles[`font-${fontSize}`]}`} ref={this.componentRef}>
            <EditorJs tools={EDITOR_JS_TOOLS} onReady={this.setUndoRedoInstance} onChange={this.onChangeEditor} instanceRef={(instance) => (this.editorInstance = instance)} />
          </div>
        </div>
        <EditorController
          insertImage={this.insertImage}
          componentRef={this.componentRef}
          setEditorFontSize={this.setFontSize}
          undoEditor={() => {
            this.undoInstance.undo();
            this.checkEditorBlockCount();
          }}
          redoEditor={() => this.undoInstance.redo()}
          isSave={this.isSave}
        />
      </div>
    );
  }
}

export default Editor;
