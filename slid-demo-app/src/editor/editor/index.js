import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import testImg from "./utils/tools/blocks/simpleImage/img_test.png";
import EditorController from "../editorController";
import Undo from "./utils/tools/undo";
import Swal from "sweetalert2";

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
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgUrl.url }, {}, this.state["lastFocusedBlockIndex"] + 1, true);
    } else {
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgUrl.url }, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
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

  showMarkupWindow = () => {
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "펜필기",
      customClass: {
        container: "position-absolute",
      },
      html:
        `<div className={styles["markup-container"]}>
          <div className={styles["markup-tool-container"]}>
            <div className={styles["markup-type-container"]}>
              <div className={"btn-group"} role="group">
                <button type="button" className={"btn btn-light"}>
                  <img className={styles["markup-type-image"]} alt={'slid cursor icon'} src={"../../../design/assets/slid_cursor_icon.png"}/>
                </button>
                <button type="button" className={"btn btn-light"}>
                  <img className={styles["markup-type-image"]} alt={'slid pen icon'} src={"../../../design/assets/slid_pen_icon.png"}/>
                </button>
                <button type="button" className={"btn btn-light"}>
                  <img className={styles["markup-type-image"]} alt={'slid highlighter icon'} src={"../../../design/assets/slid_highlighter_icon.png"}/>
                </button>
                <button type="button" className={"btn btn-light"}>
                  <img className={styles["markup-type-image"]} alt={'slid text icon'} src={"../../../design/assets/slid_text_icon.png"}/>
                </button>
              </div>
            </div>
            <div className={styles["color-picker-container"]}>
              <div className={"btn-group"} role="group">
                <button type="button" className={"styles["markup-tool-container"] btn btn-light">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16 ImageMarkup_color-picker-toggle__LnQLN" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="rgba(0,95,252,1)">
                    <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles["size-picker-container"]}>
              <div className={"btn-group"} role="group">
                <button type="button" className={"styles["size-small"] btn btn-light"}>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                </button>
                <button type="button" className={"styles["size-mideum"] btn btn-light"}>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                </button>
                <button type="button" className={"styles["size-large"] btn btn-light"}>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={styles["canvas-container"]}>
            <div className={styles["canvas"]}>
              <canvas></canvas>
            </div>
          </div>
          <div className={styles["markup-control-container"]}>
            <div className={styles["history-container"]}>
              <button className={"styles["markup-control-btn"] btn btn-light"}>
                <img className={"markup-type-img"} alt={'backward button'} src={"../../../public/design/assets/slid_backward_icon.png"}/>
              </button>
              <button className={"styles["markup-control-btn"] btn btn-light"}>
                <img className={"markup-type-img"} alt={'forward button'} src={"../../../public/design/assets/slid_forward_icon.png"}/>
              </button>
              <button className={"styles["markup-control-btn"] btn btn-light"}>
                <img className={"markup-type-img"} alt={'reset button'} src={"../../../public/design/assets/slid_trash_icon.png"}/>
              </button>
            </div>
          </div>
        </div>`,
      position: "center",
      confirmButtonText: "저장",
      confirmButtonColor: "#007bff",
      heightAuto: false,
    }).then(() => {});
  }

  render() {
    let { fontSize, isSaving } = this.state;
    const { width, lang, isMacOs } = this.props;

    EDITOR_JS_TOOLS.image.config = {
      lang: lang,
      onClickMarkup: () => {
        this.showMarkupWindow();
      }
    }

    this.handleAddListener();
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
