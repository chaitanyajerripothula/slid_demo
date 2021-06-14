import React, { createRef } from "react";
import ReactPlayer from "react-player";

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this._isMounted = true;

    if (!this.props.currentDocument) {
      this.setState({
        videoState: "empty",
      });
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={`${styles[`video-container`]}`}>
        <div className={styles[`video-view-controller-container`]}>
          <img src={`/src/design/assets/slid_video_close_icon.png`} className={`${styles["video-icon"]}`} onClick={() => {}} />
          <img
            src={`/src/design/assets/slid_video_${this.state.isFullScreen ? "shrink" : "expand"}_icon.png`}
            className={`${styles["video-icon"]}`}
            onClick={() => {
              this.toggleFullScreen();
            }}
          />
        </div>
        <div className={styles[`video-placeholder-container`]}>
          <div className={`${styles[`video-placeholder`]}`} ref={this.videoPlaceholderRef}>
            <img
              src={`/src/design/assets/slid_recording_video_red_icon.png`}
              alt=""
              className={this.props.isRecordActive ? styles[`recoding-red-icon`] : styles[`recoding-red-icon-hide`]}
              id="recoding-red-icon"
            />
            {/* 영상을 재생 및 컨트롤할 수 있는 라이브러리 */}
            <ReactPlayer
              className={styles[`video-player`]}
              url={this.props.currentDocument["mapped_videos"][this.props.videoIndex]["video_origin_url"]}
              playing={this.state.isPlaying}
              ref={this.videoPlayerRef}
              onReady={() => {
                const videoPlayerElement = this.videoPlayerRef.current.getInternalPlayer().h;
                if (videoPlayerElement) {
                  videoPlayerElement.setAttribute("data-hj-allow-iframe", "");
                }

                this.videoPlayerRef.current.forcePlay = () => {
                  this.setState({
                    isPlaying: true,
                  });
                };
                this.props.setVideoPlayerRef(this.videoPlayerRef.current);

                // when there is 'start' query string, start from the timestamp
                if (queryString.parse(this.props.location.search).start) {
                  this.videoPlayerRef.current.forcePlay();
                  const timestamp = Math.floor(queryString.parse(this.props.location.search).start);
                  this.videoPlayerRef.current.seekTo(timestamp);
                }
              }}
              onPlay={() => {
                this.setState({
                  isPlaying: true,
                });
              }}
              onPause={() => {
                this.setState({
                  isPlaying: false,
                });
              }}
              onError={() => {
                this.setState({
                  videoState: "unavailable",
                });
              }}
              controls={true}
              playbackRate={this.state.playbackSpeed}
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles[`video-play-controller-container`]}>
          <div className={styles[`setting-container`]}>
            <Dropdown drop={`right`}>
              <Dropdown.Toggle variant={`white`} className={styles[`setting-toggle`]}>
                <img className={styles[`setting-icon`]} src={`/src/design/assets/slid_setting_icon.png`} />
                <span>Video Setting</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles[`setting-popup`]}>
                <div>
                  <span className={styles[`setting-title`]}>{this.props.lang === "ko" ? "동영상 설정" : "Video setting"}</span>
                </div>
                <div>
                  <div className={`${styles[`setting-option`]}`}>
                    <span>{this.props.lang === "ko" ? "구간 이동 간격" : "Skip interval"}</span>
                    <select
                      className={`${styles[`select`]} custom-select custom-select-sm`}
                      value={this.state.skipInterval}
                      onChange={(event) => {
                        this.setState({
                          skipInterval: parseInt(event.target.value),
                        });
                      }}
                    >
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={30}>30s</option>
                      <option value={60}>60s</option>
                    </select>
                  </div>
                  <div className={`${styles[`setting-option`]}`}>
                    <span>{this.props.lang === "ko" ? "재생 속도" : "Playback Speed"}</span>
                    <select
                      className={`${styles[`select`]} custom-select custom-select-sm`}
                      value={this.state.playbackSpeed}
                      onChange={(event) => {
                        this.setState({
                          playbackSpeed: parseFloat(event.target.value),
                        });
                      }}
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={1.75}>1.75x</option>
                      <option value={2}>2x</option>
                      <option value={2.25}>2.25x</option>
                      <option value={2.5}>2.5x</option>
                    </select>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className={styles[`control-container`]}>
            <div>
              <OverlayTrigger
                placement={`top`}
                overlay={
                  <Tooltip className={`shortcut-tooltip`}>
                    {this.props.lang === "ko" ? `${this.state.skipInterval}초 뒤로 (${isMacOs ? "Cmd + J" : "Alt + J"})` : `Rewind (${isMacOs ? "Cmd + J" : "Alt + J"})`}
                  </Tooltip>
                }
              >
                <button
                  ref={this.videoBackwardButtonRef}
                  className={`${styles[`skip-btn`]} ${styles[`skip-backward-btn`]} btn btn-secondary`}
                  onClick={() => {
                    this.updateVideoTime({
                      direction: "backward",
                    });
                  }}
                >
                  -{this.state.skipInterval}{" "}
                  <img alt={`skip backward button`} className={`${styles[`skip-backward`]} ${styles[`video-icon`]}`} src={`/src/design/assets/slid_backward_white_icon.png`} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                placement={`top`}
                overlay={
                  <Tooltip className={`shortcut-tooltip`}>
                    {this.state.isPlaying
                      ? this.props.lang === "ko"
                        ? `일시정지 (${isMacOs ? "Cmd + K" : "Alt + K"})`
                        : `Pause (${isMacOs ? "Cmd + K" : "Alt + K"})`
                      : this.props.lang === "ko"
                      ? `재생 (${isMacOs ? "Cmd + K" : "Alt + K"})`
                      : `Play (${isMacOs ? "Cmd + K" : "Alt + K"})`}
                  </Tooltip>
                }
              >
                <button
                  className={`${styles[`play-btn`]} btn btn-light`}
                  onClick={() => {
                    this.toggleIsPlaying();
                  }}
                >
                  <img alt={`play pause button`} className={styles[`video-icon`]} src={`/src/design/assets/slid_${this.state.isPlaying ? "pause" : "play"}_btn_icon.png`} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                placement={`top`}
                overlay={
                  <Tooltip className={`shortcut-tooltip`}>
                    {this.props.lang === "ko" ? `${this.state.skipInterval}초 앞으로 (${isMacOs ? "Cmd + L" : "Alt + L"})` : `Fast-forward (${isMacOs ? "Cmd + L" : "Alt + L"})`}
                  </Tooltip>
                }
              >
                <button
                  ref={this.videoForwardButtonRef}
                  className={`${styles[`skip-btn`]} ${styles[`skip-forward-btn`]} btn btn-secondary`}
                  onClick={() => {
                    this.updateVideoTime({
                      direction: "forward",
                    });
                  }}
                >
                  <img alt={`skip forward button`} className={`${styles[`skip-forward`]} ${styles[`video-icon`]}`} src={`/src/design/assets/slid_forward_white_icon.png`} /> +{this.state.skipInterval}
                </button>
              </OverlayTrigger>
            </div>
          </div>
          <div className={styles[`select-controller-container`]}>
            <OverlayTrigger placement={`top`} overlay={this.props.videoIndex === 0 ? <div></div> : <Tooltip>{this.props.lang === "ko" ? "이전 영상" : "Previous video"}</Tooltip>}>
              <button
                className={`${styles[`skip-btn`]} btn btn-secondary`}
                disabled={this.props.videoIndex === 0}
                onClick={async () => {
                  if (!this.props.currentDocument || !this.props.currentDocument["mapped_videos"]) return;
                  if (this.props.videoIndex - 1 < 0) return;
                  const videoIndex = this.props.videoIndex - 1;
                  this.props.setVideoIndex(videoIndex);
                }}
              >
                <FontAwesomeIcon className={`pointer`} icon={faFastBackward} size="1x" />
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={`top`}
              defaultShow={false}
              overlay={
                this.props.currentDocument && this.props.currentDocument["mapped_videos"] ? (
                  this.props.currentDocument["mapped_videos"].length - 1 < this.props.videoIndex + 1 ? (
                    <div></div>
                  ) : (
                    <Tooltip>{this.props.lang === "ko" ? "다음 영상" : "Next video"}</Tooltip>
                  )
                ) : (
                  <div></div>
                )
              }
            >
              <button
                className={`${styles[`skip-btn`]}  btn btn-secondary`}
                disabled={
                  // if document is null or document has no videos, disable button
                  !this.props.currentDocument ||
                  !this.props.currentDocument["mapped_videos"] ||
                  // Or if video index is last of the mapped videos
                  this.props.currentDocument["mapped_videos"].length - 1 < this.props.videoIndex + 1
                }
                onClick={async () => {
                  if (!this.props.currentDocument || !this.props.currentDocument["mapped_videos"]) return;
                  if (this.props.currentDocument["mapped_videos"].length - 1 < this.props.videoIndex + 1) return;
                  const videoIndex = this.props.videoIndex + 1;
                  this.props.setVideoIndex(videoIndex);
                }}
              >
                <FontAwesomeIcon className={`pointer`} icon={faFastForward} size="1x" />
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    );
  }
}

const actions = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, actions)(withRouter(VideoPlayer));
