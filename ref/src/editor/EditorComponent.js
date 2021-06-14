import React, { Component } from "react";

import EditorJs from "react-editor-js";
import Tools from "../../utils/editor/tools/Tools";
import ImageMarkup from "../popups/ImageMarkup";

class EditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    // START: EditorJS tools addtional property setting
    const inlineToolbarCompetibleBlocks = ["paragraph", "list", "nestedList", "header", "checklist"];
    inlineToolbarCompetibleBlocks.forEach((blockType) => {
      Tools[blockType].inlineToolbar = true;
    });

    Tools.paragraph.config = {
      preserveBlank: true,
      convertBlock: ({ blockIndex, blockType, value }) => {
        this.convertBlock({ blockIndex, blockType, value });
      },
      checkIsAutoFormatActive: () => {
        return this.props.isAutoFormatActive;
      },
    };

    Tools.header.config = {
      placeholder: "Enter a header",
      levels: [4],
      defaultLevel: 4,
    };

    Tools.image.config = {
      lang: this.props.lang,
      onClickPlayVideoFromTs: (params) => {
        this.playVideoFromTs(params);
      },
      onClickMarkup: (params) => {
        this.imageMarkupProps = params;
        this.props.setShowImageMarkupPopup(true);
      },
      onClickOcr: (params) => {
        this.setOcrResult(params);
      },
      saveDocument: () => {
        this.saveDocument();
      },
      onClickImage: () => {
        this.props.setEditorLastActiveBlockPosition(this.props.editorInstance.blocks.getCurrentBlockIndex());
      },
      onDragAndDropImageBlock: (params) => {
        this.onDragAndDropImageBlock(params);
      },
      onPasteImageUrl: (params) => {
        this.onPasteImageUrl(params);
      },
      onPasteFile: (params) => {
        this.onPasteFile(params);
      },
    };

    Tools.video.config = {
      onClickVideo: () => {
        this.props.setEditorLastActiveBlockPosition(this.props.editorInstance.blocks.getCurrentBlockIndex());
      },
    };

    Tools.videoLoader.config = {
      onClickLoader: () => {
        this.props.setEditorLastActiveBlockPosition(this.props.editorInstance.blocks.getCurrentBlockIndex());
      },
    };

    Tools.codeTool.config = {
      convertBlock: ({ blockIndex, blockType, value }) => {
        this.convertBlock({ blockIndex, blockType, value });
      },
    };

    const EDITOR_JS_TOOLS = Tools;
    // END: EditorJS tools addtional property setting

    return (
      <div className={styles[`editor-wrapper`]}>
        <div className={styles[`editor-title-container`]}>
          <h1 className={`${styles[`editor-title`]} ${styles[`font-${this.props.editorFontSize}`]} font-${this.props.editorFontSize}`}>
            <input
              ref={this.editorTitleRef}
              className={styles[`editor-title-input`]}
              type={`text`}
              autoComplete={`off`}
              autoFocus={true}
              readOnly={this.props.isReadOnly}
              placeholder={this.props.lang === "ko" ? "제목을 입력하세요" : `Enter title`}
              value={
                // when sharing mode and when title is empty, show "Untitled".
                this.isSharingMode ? (this.state.title ? this.state.title : this.props.lang === "ko" ? "제목없음" : `Untitled`) : this.state.title
              }
              onChange={(event) => {
                this.setState({
                  title: event.target.value,
                });
                this.tryCreateDocumentHistory();
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  if (!this.props.editorInstance || !this.props.editorInstance.blocks) return;
                  this.props.editorInstance.blocks.insert(
                    "paragraph",
                    {
                      text: "",
                    },
                    {},
                    0,
                    true
                  );
                  this.props.editorInstance.caret.setToFirstBlock();
                }
              }}
            />
          </h1>
        </div>
        <div className={`${styles[`editor-content-container`]} ${styles[`font-${this.props.editorFontSize}`]} font-${this.props.editorFontSize}`}>
          <EditorJs
            instanceRef={(instance) => {
              this.props.setEditorInstance(instance);
            }}
            tools={EDITOR_JS_TOOLS}
            initialBlock={"paragraph"}
            autofocus={false}
            onReady={() => {
              this.props.setShowPlaceholder(true);
              this.setEditorEventListenerAndUndoInstanceAndDragDropInstance();
            }}
            onChange={async () => {
              // prevent save when document is selected.
              if (!this.state.isDocumentTouched) return;
              this.tryCreateDocumentHistory();
              const fetchCurrentDocument = false;
              this.saveDocument(fetchCurrentDocument);
            }}
            logLevel={`ERROR`}
          />
          {this.props.showPlaceholder ? (
            <div
              className={`${styles[`placeholder-container`]}`}
              onClick={() => {
                if (!this.props.editorInstance || !this.props.editorInstance.blocks) return;

                if (this.props.editorInstance.blocks.getBlocksCount() === 0) {
                  this.props.editorInstance.blocks.insert(
                    "paragraph",
                    {
                      text: "",
                    },
                    {},
                    0,
                    true
                  );
                  this.props.editorInstance.caret.setToFirstBlock();
                } else {
                  this.props.editorInstance.focus();
                }
              }}
            >
              {this.props.lang === "ko" ? (
                <div>
                  이곳을 클릭해 타이핑을 시작하거나,{" "}
                  <span
                    className={styles[`open-recent-document-btn`]}
                    onClick={(event) => {
                      if (this.props.documents) {
                        event.stopPropagation();
                        this.props.setShowSearchPopup(true);
                      }
                    }}
                  >
                    최근 작성한 문서
                  </span>
                  를 불러오세요. <br />
                  이미 자료가 있다면{" "}
                  <span
                    className={styles[`upload-file-btn`]}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.fileUploadInputRef.current.click();
                    }}
                  >
                    PDF 파일을 업로드
                  </span>{" "}
                  할 수도 있습니다.
                </div>
              ) : (
                <div>
                  Click here to start typing or{" "}
                  <span
                    className={styles[`open-recent-document-btn`]}
                    onClick={(event) => {
                      if (this.props.documents) {
                        event.stopPropagation();
                        this.props.setShowSearchPopup(true);
                      }
                    }}
                  >
                    open recent document.
                  </span>{" "}
                  <br />
                  You can also{" "}
                  <span
                    className={styles[`upload-file-btn`]}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.fileUploadInputRef.current.click();
                    }}
                  >
                    upload a PDF file.
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
        {this.props.showImageMarkupPopup ? (
          <div
            className={styles[`popup-layer`]}
            onClick={(event) => {
              if (!this.popupRef.current.contains(event.target)) {
                this.props.setShowImageMarkupPopup(false);
              }
            }}
          >
            <div ref={this.popupRef} className={styles[`popup-container`]}>
              <ImageMarkup {...this.imageMarkupProps} />
            </div>
          </div>
        ) : null}

        <input
          type={`file`}
          name={`upload`}
          ref={this.fileUploadInputRef}
          className={`d-none`}
          accept={`.pdf`}
          onChange={(event) => {
            if (event.target.files[0].size > 100000000) {
              Sweetalert.fire({
                target: `.${styles[`editor-wrapper`]}`,
                heightAuto: false,
                customClass: {
                  container: "position-absolute",
                },
                icon: "error",
                title: "PDF too large!",
                html: `
                                                Pdf should be less than 100mb. <br/>
                                                Try again with smaller file.
                                            `,
                confirmButtonText: "Close",
              });
              return;
            }
            this.uploadPdf({
              file: event.target.files[0],
            });
          }}
        />
      </div>
    );
  }
}
const actions = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, actions)(withRouter(EditorComponent));
