import React from "react";
import EditorComponent from "../editor/EditorComponent";

class VideoDocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles[`video-document-container`]} id={`video-document-container`}>
        <div className={`${styles[`list-container`]} ${this.props.isListOpen ? "" : "d-none"}`} ref={this.listContainerRef}>
          <DocumentListView />
        </div>
        <div className={`${styles[`header`]} ${this.props.screenOrientation === "vertical" ? styles[`vertical`] : styles[`horizontal`]}`}>
          <div className={`${styles[`header-left-container`]}`}>
            <img
              className={styles[`list-open-icon`]}
              src={`/src/design/assets/slid_list_open_icon.png`}
              onClick={() => {
                this.props.setIsListOpen(true);
              }}
              alt={``}
            />

            {this.props.isCognitoUser ? null : (
              <span
                className={`badge bg-primary text-white pointer ml-3`}
                onClick={() => {
                  this.showGuestModeAlert({ shouldForceSignup: false });
                }}
              >
                {this.props.lang === "ko" ? "비회원 이용 중" : "Guest Mode"}
              </span>
            )}
          </div>
          <div className={styles[`header-right-container`]}>
            {this.props.isCognitoUser ? (
              <>
                <div
                  className={`${styles[`history-btn-container`]} ${this.props.currentDocument && this.props.currentDocument["document_key"] ? "" : "d-none"} mr-2`}
                  onClick={() => {
                    this.openDocumentHistory();
                  }}
                >
                  <OverlayTrigger placement={`bottom`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "노트 변경 내역" : "Note History"}</Tooltip>}>
                    <img alt={``} className={styles[`history-btn`]} src={`/src/design/assets/slid_history_icon.png`} />
                  </OverlayTrigger>
                </div>

                <div
                  className={`${styles[`share-btn-container`]} ${this.props.currentDocument && this.props.currentDocument["document_key"] ? "" : "d-none"} mr-2`}
                  onClick={() => {
                    this.props.setShowSharePopup(true);
                  }}
                >
                  <OverlayTrigger placement={`bottom`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "노트 공유" : "Note Share"}</Tooltip>}>
                    <img alt={``} className={styles[`share-btn`]} src={`/src/design/assets/slid_share_link_gray_icon.png`} />
                  </OverlayTrigger>
                </div>
              </>
            ) : (
              <span className={`mr-1`}>{this.props.lang === "ko" ? `도움이 필요하신가요?` : `Need help?`} 👉</span>
            )}

            <Dropdown>
              <Dropdown.Toggle variant={`white`} className={styles[`help-icon-container`]}>
                <img className={styles[`help-icon`]} src={`/src/design/assets/slid_help_blue_icon.png`} alt={``} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className={styles[`help-item`]}
                  onClick={() => {
                    // open YouTube Video explaining Slid
                    window.open(this.props.lang === "ko" ? `https://www.youtube.com/watch?v=Mao7Wvfn-F4` : `https://www.youtube.com/watch?v=fSghyubwNkM`);
                  }}
                >
                  <img src={`/src/design/assets/slid_monitor_icon.png`} className={styles[`help-icon-img`]} alt={``} /> {this.props.lang === "ko" ? "슬리드 사용법" : "How to Slid"}
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  className={styles[`help-item`]}
                  onClick={() => {
                    ReactSweetalert.fire({
                      target: `.${styles[`video-document-container`]}`,
                      heightAuto: false,
                      width: "85%",
                      customClass: {
                        container: "position-absolute",
                      },
                      title: this.props.lang === "ko" ? "단축키" : "Shortcut",
                      html: (
                        <div>
                          <div>
                            <p className={`text-left font-weight-bold text-primary`}>{this.props.lang === "ko" ? "* 에디터 단축키" : "* Editor Shortcut"}</p>
                            <div className="bg-light container-fluid p-3 text-left">
                              <div className={`row`}>
                                <div className={`col-5`}>{this.props.lang === "ko" ? "수동 캡쳐" : "Screen capture"}</div>
                                <div className={`col-7`}>
                                  <span className={`shortcut-badge badge badge-secondary px-2 `}>{isMacOs ? "Cmd" : "Alt"}</span> +{" "}
                                  <span className={`shortcut-badge badge badge-secondary px-2`}>/</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* show video shortcut */}
                          {/* when extension, use currentVideo state from redux */}
                          {/* when web, use mapped_videos */}
                          {(this.props.applicationType === "extension" && this.props.currentVideo["videoType"] !== "iframe") ||
                          (this.props.applicationType === "web" &&
                            this.props.currentDocument &&
                            this.props.currentDocument["mapped_videos"] &&
                            this.props.currentDocument["mapped_videos"][this.props.videoIndex] &&
                            this.props.currentDocument["mapped_videos"][this.props.videoIndex]["video_type"] !== "iframe") ? (
                            <div className={`mt-3`}>
                              <p className={`text-left font-weight-bold text-primary`}>{this.props.lang === "ko" ? "* 영상 단축키" : "* Video Shortcut"}</p>
                              <div className="bg-light container-fluid p-3 text-left">
                                <div className={`row`}>
                                  <div className={`col-5`}>{this.props.lang === "ko" ? "재생 / 일시정지" : "Play / Pause"}</div>
                                  <div className={`col-7`}>
                                    <span className={`shortcut-badge badge badge-secondary px-2 `}>{isMacOs ? "Cmd" : "Alt"}</span> +{" "}
                                    <span className={`shortcut-badge badge badge-secondary px-2`}>{"K"}</span>
                                  </div>
                                </div>
                                <hr />
                                <div className={`row`}>
                                  <div className={`col-5`}>{this.props.lang === "ko" ? "구간 이동" : "Skip"}</div>
                                  <div className={`col-7`}>
                                    <span className={`shortcut-badge badge badge-secondary px-2`}>{isMacOs ? "Cmd" : "Alt"}</span> +{" "}
                                    <span className={`shortcut-badge badge badge-secondary px-2`}>{"J"}</span> / <span className={`shortcut-badge badge badge-secondary px-2`}>{"L"}</span>
                                  </div>
                                </div>
                                <hr />
                                <div className={`row`}>
                                  <div className={`col-5`}>{this.props.lang === "ko" ? "영상 배속" : "Speed"}</div>
                                  <div className={`col-7`}>
                                    <span className={`shortcut-badge badge badge-secondary px-2`}>{isMacOs ? "Cmd" : "Alt"}</span> +{" "}
                                    <span className={`shortcut-badge badge badge-secondary px-2`}>{";"}</span> / <span className={`shortcut-badge badge badge-secondary px-2`}>{"'"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ),
                      showConfirmButton: false,
                    });
                  }}
                >
                  <img src={`/src/design/assets/slid_info_icon.png`} className={styles[`help-icon-img`]} alt={``} /> {this.props.lang === "ko" ? "단축키" : "Shortcut"}
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  className={styles[`help-item`]}
                  onClick={async () => {
                    if (this.props.applicationType === "extension") {
                      window.open(`/docs?mode=chatOpen`);
                    } else if (this.props.applicationType === "desktop") {
                      this.sendMessageToPrimary({
                        type: "IFRAME_TO_PRIMARY_OPEN_URL",
                        payload: "https://slid.cc/docs?mode=chatOpen",
                      });
                    } else {
                      this.props.history.push(`/docs?mode=chatOpen`);
                    }
                  }}
                >
                  <img src={`/src/design/assets/slid_feedback_black_icon.png`} className={styles[`help-icon-img`]} alt={``} /> {this.props.lang === "ko" ? "채팅 문의" : "Help Center"}
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  className={`${styles[`help-item`]} ${styles[`my-account`]}`}
                  onClick={async () => {
                    if (this.props.applicationType === "extension") {
                      window.open(`/docs?mode=myAccount`);
                    } else if (this.props.applicationType === "desktop") {
                      this.sendMessageToPrimary({
                        type: "IFRAME_TO_PRIMARY_OPEN_URL",
                        payload: "https://slid.cc/docs?mode=myAccount",
                      });
                    } else {
                      this.props.history.push(`/docs?mode=myAccount`);
                    }
                  }}
                >
                  <img alt={``} src={`/src/design/assets/slid_account_icon.png`} className={styles[`help-icon-img`]} /> {this.props.lang === "ko" ? "내 계정" : "My Account"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div
          id={`editor-container`}
          className={`${styles[`editor-container`]} ${this.props.screenOrientation === "vertical" ? styles[`vertical`] : styles[`horizontal`]}`}
          onClick={(event) => {
            if (this.props.isListOpen && !this.listContainerRef.current.contains(event.target)) {
              this.props.setIsListOpen(false);
            }
          }}
        >
          <div className={`${styles[`editor-option-container`]} d-flex justify-content-between`}>
            <select
              className={`${styles[`document-folder-selector`]} custom-select`}
              onChange={(event) => {
                this.onDocumentFolderChange(event.target.value);
              }}
              value={this.props.currentDocument ? this.props.currentDocument["parent_key"] : "root"}
            >
              <option key={`document-folder-root`} value={`root`}>
                {this.props.lang === "ko" ? "폴더 미지정" : "No folder"}
              </option>
              {this.getFolderOptionTags()}
              <option key={`document-folder-new`} value={`newFolder`}>
                {this.props.lang === "ko" ? "[폴더 생성]" : "[Create new folder]"}
              </option>
            </select>

            {/* <OverlayTrigger
                          placement={`top`}
                          defaultShow={false}
                          overlay={
                              <Tooltip>
                                  Bookmark
                              </Tooltip>
                          }
                      >
                          <img alt={``}
                              src={`/src/design/assets/slid_bookmark${isBookmarkSelected ? "_selected" : ""}_icon.png`}
                              className={styles[`bookmark-btn`]}
                              onClick={()=>{
                                  setIsBookmarkSelected(!isBookmarkSelected);
                              }}
                          />
                      </OverlayTrigger> */}
          </div>
          <EditorComponent />
        </div>
        {!isMobileOrTablet ? (
          <ReactResizeDetector handleWidth>
            {({ width }) => {
              return (
                <div className={`${styles[`editor-controller-container`]}`}>
                  <div className={`${styles[`left-container`]} container`}>
                    <div className={`${styles[`undo-redo-container`]} row h-50`}>
                      <div
                        className={`col-6 text-center`}
                        onClick={() => {
                          this.props.undoInstance.undo();
                        }}
                      >
                        <img alt={``} src={`/src/design/assets/slid_backward_icon.png`} className={styles[`control-icon`]} />
                      </div>
                      <div
                        className={`col-6 text-center`}
                        onClick={() => {
                          this.props.undoInstance.redo();
                        }}
                      >
                        <img alt={``} src={`/src/design/assets/slid_forward_icon.png`} className={styles[`control-icon`]} />
                      </div>
                    </div>
                    <div className={`${styles[`setting-container`]} row h-50`}>
                      <Dropdown drop={`up`}>
                        <Dropdown.Toggle variant={`white`} className={styles[`setting-toggle`]}>
                          <img alt={``} src={`/src/design/assets/slid_setting_icon.png`} className={styles[`setting-icon`]} /> <span className={styles[`setting-text`]}>Editor setting</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles[`setting-popup`]}>
                          <div>
                            <span className={styles[`setting-title`]}>{this.props.lang === "ko" ? "에디터 설정" : "Editor setting"}</span>
                          </div>
                          <div>
                            <div className={`${styles[`setting-option`]}`}>
                              <span>{this.props.lang === "ko" ? "폰트 크기" : "Font size"}</span>
                              <select
                                className={`${styles[`select`]} custom-select custom-select-sm`}
                                onChange={(event) => {
                                  this.props.setEditorFontSize(event.target.value);
                                }}
                                value={this.props.editorFontSize}
                              >
                                <option value={`small`}>Small</option>
                                <option value={`medium`}>Medium</option>
                                <option value={`large`}>Large</option>
                              </select>
                            </div>
                            <div className={`${styles[`setting-option`]}`}>
                              <span>{this.props.lang === "ko" ? "자동 형식 변환" : "Auto format"}</span>
                              <select
                                className={`${styles[`select`]} custom-select custom-select-sm`}
                                onChange={(event) => {
                                  // Use JSON.parse() to parse string 'true'/'false' to boolean.
                                  const isActive = JSON.parse(event.target.value);
                                  this.props.setIsAutoFormatActive(isActive);
                                }}
                                value={this.props.isAutoFormatActive}
                              >
                                <option value={true}>On</option>
                                <option value={false}>Off</option>
                              </select>
                            </div>
                            <div className={`${styles[`setting-option`]}`}>
                              <span>{this.props.lang === "ko" ? "부가 기능" : "Add-on"}</span>
                              <select
                                className={`${styles[`select`]} custom-select custom-select-sm`}
                                onChange={(event) => {
                                  this.setState({
                                    addonFeature: event.target.value,
                                  });
                                }}
                                value={this.state.addonFeature}
                              >
                                <option value={`clip_recording`}>{this.props.lang === "ko" ? "클립 녹화" : "Clip recording"}</option>
                                {/* only show ppt extract for past pro users */}
                                {this.props.isCognitoUser &&
                                this.props.userData &&
                                this.props.userData["payment"] === "pro" &&
                                new Date(this.props.userData["created_time"]) < new Date(AUTO_EXTRACT_BLOCK_DATE) ? (
                                  <option value={`auto_capture`}>{this.props.lang === "ko" ? "PPT 추출" : "Extract PPT"}</option>
                                ) : null}
                              </select>
                            </div>
                            <div className={`${styles[`setting-option`]}`}>
                              <span>{this.props.lang === "ko" ? "최근 문서 열기" : "Open recent note"}</span>
                              <select
                                className={`${styles[`select`]} custom-select custom-select-sm`}
                                onChange={(event) => {
                                  this.setState({
                                    openRecentNote: event.target.value,
                                  });
                                  setDefaultSettingCookie({
                                    property: `openRecentNote`,
                                    value: event.target.value,
                                  });
                                }}
                                value={this.state.openRecentNote}
                              >
                                <option value={true}>On</option>
                                <option value={false}>Off</option>
                              </select>
                            </div>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className={styles[`center-container`]}>
                    {width > 400 ? (
                      <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "캡쳐 영역 지정" : "Set capture area"}</Tooltip>}>
                        <button
                          className={`${styles[`capture-option-btn`]} btn btn-light`}
                          onClick={() => {
                            this.showSelectAreaPopup();
                          }}
                        >
                          <img alt={``} src={`/src/design/assets/slid_set_area${this.props.isCaptureAreaActive ? "_active" : ""}_icon.png`} className={styles[`set-area-icon`]} />
                        </button>
                      </OverlayTrigger>
                    ) : null}
                    {width > 400 ? (
                      <OverlayTrigger
                        placement={`top`}
                        defaultShow={false}
                        overlay={
                          <Tooltip>
                            {this.props.lang === "ko" ? (
                              <>
                                원클릭 캡쳐 <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                              </>
                            ) : (
                              <>
                                Screenshot <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                              </>
                            )}
                          </Tooltip>
                        }
                      >
                        <button
                          className={`${styles[`capture-btn`]} btn btn-primary`}
                          disabled={this.state.isCapturing}
                          onClick={() => {
                            this.manualCapture();
                          }}
                          onContextMenu={(event) => {
                            event.preventDefault();
                          }}
                        >
                          {this.state.isCapturing ? (
                            <img alt={``} src={`/src/design/assets/slid_loading_circle_icon.png`} className={styles[`loading-icon`]} />
                          ) : (
                            <img alt={``} src={`/src/design/assets/slid_capture_icon.png`} className={styles[`capture-icon`]} />
                          )}
                        </button>
                      </OverlayTrigger>
                    ) : (
                      <Dropdown drop={`up`} show={this.state.isCaptureOptionActive} className={styles[`capture-option-container`]}>
                        <Dropdown.Toggle variant={`white`} className={styles[`setting-toggle`]}>
                          <OverlayTrigger
                            placement={`top`}
                            defaultShow={false}
                            overlay={
                              <Tooltip>
                                {this.props.lang === "ko" ? (
                                  <>
                                    원클릭 캡쳐 <br />({isMacOs ? "Cmd + /" : "Ctrl + /"})
                                  </>
                                ) : (
                                  <>
                                    Screenshot <br />({isMacOs ? "Cmd + /" : "Ctrl + /"})
                                  </>
                                )}
                                )}
                              </Tooltip>
                            }
                          >
                            <button
                              className={`${styles[`capture-btn`]} btn btn-primary`}
                              disabled={this.state.isCapturing}
                              onClick={() => {
                                this.manualCapture();
                              }}
                              onContextMenu={(event) => {
                                event.preventDefault();
                                this.setState({
                                  isCaptureOptionActive: !this.state.isCaptureOptionActive,
                                });
                              }}
                            >
                              {this.state.isCapturing ? (
                                <img alt={``} src={`/src/design/assets/slid_loading_circle_icon.png`} className={styles[`loading-icon`]} />
                              ) : (
                                <img alt={``} src={`/src/design/assets/slid_capture_icon.png`} className={styles[`capture-icon`]} />
                              )}
                            </button>
                          </OverlayTrigger>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles[`setting-popup`]}>
                          <div>
                            <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "캡쳐 영역 지정" : "Set capture area"}</Tooltip>}>
                              <button
                                className={`${styles[`capture-option-btn`]} btn btn-light`}
                                onClick={() => {
                                  this.showSelectAreaPopup();
                                }}
                              >
                                <img alt={``} src={`/src/design/assets/slid_set_area${this.props.isCaptureAreaActive ? "_active" : ""}_icon.png`} className={styles[`set-area-icon`]} />
                              </button>
                            </OverlayTrigger>
                            {this.state.addonFeature === "auto_capture" ? (
                              this.state.isAutoCapturing ? (
                                <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "취소" : "Cancel"}</Tooltip>}>
                                  <button
                                    className={`${styles[`capture-option-btn`]} btn btn-light`}
                                    onClick={() => {
                                      this.stopAutoCapture();
                                    }}
                                  >
                                    <img alt={``} src={`/src/design/assets/slid_loading_circle_icon.png`} className={styles[`loading-icon`]} />
                                  </button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "PPT 자동 추출" : "Extract PPT"}</Tooltip>}>
                                  <button
                                    className={`${styles[`capture-option-btn`]} btn btn-light`}
                                    onClick={() => {
                                      this.startAutoCapture();
                                    }}
                                  >
                                    <img alt={``} src={`/src/design/assets/slid_auto_icon.png`} className={styles[`auto-icon`]} />
                                  </button>
                                </OverlayTrigger>
                              )
                            ) : (
                              <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "클립 녹화" : "Clip recording"}</Tooltip>}>
                                <div className={`${styles[`record-box`]}`}>
                                  <button
                                    className={`${styles[`capture-option-btn`]} btn btn-light`}
                                    onClick={() => {
                                      if (this.props.isRecordActive) {
                                        this.clipRecordStop();
                                      } else {
                                        this.clipRecordStart();
                                      }
                                    }}
                                  >
                                    <img alt={``} src={`/src/design/assets/slid_recording_gray_icon.png`} className={styles[this.props.isRecordActive ? "record-active" : "auto-icon"]} />
                                  </button>
                                </div>
                              </OverlayTrigger>
                            )}
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}

                    {/* Only show auto capture for current pro users*/}

                    {this.state.addonFeature === "auto_capture" ? (
                      width > 400 ? (
                        this.state.isAutoCapturing ? (
                          <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "취소" : "Cancel"}</Tooltip>}>
                            <button
                              className={`${styles[`capture-option-btn`]} btn btn-light`}
                              onClick={() => {
                                this.stopAutoCapture();
                              }}
                            >
                              <img alt={``} src={`/src/design/assets/slid_loading_circle_icon.png`} className={styles[`loading-icon`]} />
                            </button>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "PPT 자동 추출" : "Extract slides"}</Tooltip>}>
                            <button
                              className={`${styles[`capture-option-btn`]} btn btn-light`}
                              onClick={() => {
                                this.startAutoCapture();
                              }}
                            >
                              <img alt={``} src={`/src/design/assets/slid_auto_icon.png`} className={styles[`auto-icon`]} />
                            </button>
                          </OverlayTrigger>
                        )
                      ) : null
                    ) : width > 400 ? (
                      <OverlayTrigger placement={`top`} defaultShow={false} overlay={<Tooltip>{this.props.lang === "ko" ? "클립 녹화" : "Clip recording"}</Tooltip>}>
                        <div className={`${styles[`record-box`]}`}>
                          <button
                            className={`${styles[`capture-option-btn`]} btn btn-light`}
                            onClick={() => {
                              if (this.props.isRecordActive) {
                                this.clipRecordStop();
                              } else {
                                this.clipRecordStart();
                              }
                            }}
                          >
                            <img alt={``} src={`/src/design/assets/slid_recording_gray_icon.png`} className={styles[this.props.isRecordActive ? "record-active" : "auto-icon"]} />
                          </button>
                        </div>
                      </OverlayTrigger>
                    ) : null}

                    {/* Only show auto capture for current pro users*/}

                    {this.state.addonFeature === "auto_capture" ? (
                      width > 400 && this.state.isAutoCapturing ? (
                        <div className={`${styles[`progress-container`]} progress`}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            aria-valuenow={this.state.autoCaptureProgressPercent}
                            aria-valuemin={`0`}
                            aria-valuemax={`100`}
                            style={{
                              width: `${this.state.autoCaptureProgressPercent}%`,
                            }}
                          ></div>
                        </div>
                      ) : null
                    ) : null}
                  </div>
                  <div className={`${styles[`right-container`]} container`}>
                    <div
                      className={`${styles[`save-container`]} row h-50`}
                      onClick={() => {
                        this.saveDocument();
                        this.props.fetchDocuments(this.props.accessToken);
                      }}
                    >
                      <img alt={``} src={`/src/design/assets/slid_double_check_icon.png`} className={styles[`save-icon`]} />{" "}
                      {this.props.isEditorSaved ? (this.props.lang === "ko" ? "저장 완료" : "Auto Saved") : this.props.lang === "ko" ? "자동 저장 중..." : "Saving..."}
                    </div>
                    <div className={`${styles[`download-container`]} row h-50`}>
                      <Dropdown drop={`up`}>
                        <Dropdown.Toggle variant={`white`} className={styles[`download-toggle`]}>
                          <img alt={``} src={`/src/design/assets/slid_download_icon.png`} className={styles[`download-icon`]} /> Download
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles[`download-popup`]}>
                          <div>
                            <span className={styles[`download-title`]}>{this.props.lang === "ko" ? "다운로드 옵션" : "Download options"}</span>
                          </div>
                          <div>
                            {this.renderPdfPrint()}
                            <Dropdown.Item
                              className={`${styles[`download-option`]}`}
                              onClick={() => {
                                this.downloadWord();
                              }}
                            >
                              <img alt={``} src={`/src/design/assets/slid_download_word_icon.png`} className={styles[`download-type-icon`]} /> Word
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={`${styles[`download-option`]}`}
                              onClick={() => {
                                this.downloadMarkdown();
                              }}
                            >
                              <img alt={``} src={`/src/design/assets/slid_download_markdown_icon.png`} className={styles[`download-type-icon`]} /> Markdown
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={`${styles[`download-option`]}`}
                              onClick={() => {
                                this.downloadImages();
                              }}
                            >
                              <img alt={``} src={`/src/design/assets/slid_download_png_icon.png`} className={styles[`download-type-icon`]} /> Images
                            </Dropdown.Item>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              );
            }}
          </ReactResizeDetector>
        ) : null}

        {this.props.showSearchPopup ? (
          <div
            className={styles[`popup-layer`]}
            onClick={(event) => {
              if (!this.searchPopupRef.current.contains(event.target)) {
                this.props.setShowSearchPopup(false);
              }
            }}
          >
            <div ref={this.searchPopupRef} className={styles[`popup-container`]}>
              <DocumentSearch />
            </div>
          </div>
        ) : null}
        {this.props.showDeletedDocumentsPopup ? (
          <div
            className={styles[`popup-layer`]}
            onClick={(event) => {
              if (!this.deletedDocumentsPopupRef.current.contains(event.target)) {
                this.props.setShowDeletedDocumentsPopup(false);
              }
            }}
          >
            <div ref={this.deletedDocumentsPopupRef} className={styles[`popup-container`]}>
              <DeletedDocuments />
            </div>
          </div>
        ) : null}
        {this.state.isOnboardingPopupOpen ? (
          <div className={styles[`vdocs-onboarding-container`]}>
            <img
              alt={``}
              className={`${styles[`vdocs-onboarding-img`]} ${styles[`step${this.state.onboardingStep}`]}`}
              src={`/src/design/assets/slid_vdocs_onboarding_step${this.state.onboardingStep}_${this.props.lang === "ko" ? "ko" : "en"}.png`}
              onClick={(event) => {
                if (this.state.onboardingStep === 1) {
                  this.setState({
                    onboardingStep: 2,
                  });
                } else if (this.state.onboardingStep === 2) {
                  this.setState({
                    onboardingStep: 3,
                  });
                } else {
                  this.setState({
                    isOnboardingPopupOpen: false,
                  });
                  this.setState({
                    onboardingStep: 1,
                  });
                }
              }}
            />
          </div>
        ) : null}
        {this.props.showSharePopup ? (
          <div
            className={styles[`popup-layer`]}
            onClick={(event) => {
              if (!this.sharePopupRef.current.contains(event.target)) {
                this.props.setShowSharePopup(false);
              }
            }}
          >
            <div ref={this.sharePopupRef} className={styles[`popup-container`]}>
              <DocumentShare />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const actions = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, actions)(withRouter(withCookies(VideoDocumentEditor)));
