import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import testImg from "./utils/tools/blocks/simpleImage/img_test.png";
import EditorController from "../editorController";
import Undo from "./utils/tools/undo";

class Editor extends React.PureComponent {
  componentRef = React.createRef();
  noteSavingTimeoutId = 1;
  ceBlocks = document.getElementsByClassName("ce-block");

  constructor(props) {
    super(props);
    this.state = {
      undoInstance: this.handleSetUndoRedoInstance,
      fontSize: "small",
      lastFocusedBlockIndex: 0,
      isSaving: true,
    };
  }

  async componentDidMount() {}

  handleAddListener = () => {
    for (let index = 0; index < this.ceBlocks.length; index++) {
      this.ceBlocks[index].addEventListener("focusout", (event) => {
        this.setState({ lastFocusedBlockIndex: index });
      });
    }
  };

  handleSetUndoRedoInstance = () => {
    const editor = this.editorInstance;
    this.undoInstance = new Undo({ editor });
  };

  handleChangeEditor = () => {
    if (this.state["isSaving"]) {
      clearTimeout(this.noteSavingTimeoutId);
    }
    this.setState({ isSaving: false });

    this.noteSavingTimeoutId = setTimeout(() => {
      this.setState({ isSaving: true });
    }, 300);

    this.setState({ lastFocusedBlockIndex: this.editorInstance.blocks.getCurrentBlockIndex() === -1 ? this.state["lastFocusedBlockIndex"] : this.editorInstance.blocks.getCurrentBlockIndex() });
  };

  handleInsertImage = () => {
    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgUrl }, {}, this.state["lastFocusedBlockIndex"] + 1, true);
    } else {
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgUrl }, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
    }
  };

  handleCheckEditorBlockCount = () => {
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

  handleChangeTitle = (e) => {
    if (e.target.value) {
      document.title = e.target.value;
    } else {
      document.title = this.props.lang === "ko-KR" ? "제목 없음" : "Untitle";
    }
  };

  handleKeyPress = (e) => {
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

  handleSetFontSize = (size) => {
    this.setState({ fontSize: size ? size : "small" });
  };

  render() {
    let { fontSize, isSaving } = this.state;
    const { width, lang, isMacOs } = this.props;
    this.handleAddListener();

    EDITOR_JS_TOOLS.paragraph.config = {
      // 자동형식변환기능 -> false(현재 demo 페이지에서 보이지 않는 기능임으로 임시적으로 false 처리)
      checkIsAutoFormatActive: () => {
        return true;
      },
    };

    return (
      <div className={`${styles[`container`]}`}>
        <h1 className={`${styles[`font-${fontSize}`]}`}>
          <input
            className={`${styles[`input-title`]}`}
            type="text"
            onChange={this.handleChangeTitle}
            placeholder={lang === "ko-KR" ? "제목을 입력하세요" : "Enter title"}
            autoComplete="false"
            autoFocus={true}
            onKeyPress={this.handleKeyPress}
          />
        </h1>
        <div className={`${styles[`editor-container`]} ${styles[`font-${fontSize}`]}`} ref={this.componentRef}>
          <EditorJs
            className={`${styles[`editor-js`]}`}
            tools={EDITOR_JS_TOOLS}
            onReady={this.handleSetUndoRedoInstance}
            onChange={this.handleChangeEditor}
            instanceRef={(instance) => (this.editorInstance = instance)}
          />
        </div>

        <EditorController
          selectAreaCoordinate={this.props.selectAreaCoordinate}
          captureImgUrl={this.props.captureImgUrl}
          isCapturingOneClick={this.props.isCapturingOneClick}
          setSelectAreaCoordinate={this.props.setSelectAreaCoordinate}
          setShowSelectAreaCanvas={this.props.setShowSelectAreaCanvas}
          setCaptureSelectArea={this.props.setCaptureSelectArea}
          setCaptureImgUrl={this.props.setCaptureImgUrl}
          handleInsertImage={this.handleInsertImage}
          componentRef={this.componentRef}
          handleSetFontSize={this.handleSetFontSize}
          undoEditor={() => {
            this.undoInstance.undo();
            this.handleCheckEditorBlockCount();
          }}
          redoEditor={() => this.undoInstance.redo()}
          isSaving={isSaving}
          setIsCapturingOneClick={this.props.setIsCapturingOneClick}
          editorWidth={width}
          lang={lang}
          isMacOs={isMacOs}
        />
      </div>
    );
  }
}

export default Editor;
