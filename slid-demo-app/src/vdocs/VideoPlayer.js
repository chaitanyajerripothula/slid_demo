import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Dropdown, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import VideoCapture from "./VideoCapture";
import styles from "./VideoPlayer.module.css";
import { fabric } from "fabric";

const VideoPlayer = (props) => {
  const { show } = props;

  const [canvas, setCanvas] = useState("");
  const [isPlaying, setIsPlaying] = useState();
  const [videoState, setVideoState] = useState("empty");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [skipInterval, setSkipInterval] = useState(5);

  const canvasRef = useRef();
  const fabricCanvas = useRef();
  const videoPlayerRef = useRef();
  const videoPlaceholderRef = useRef();
  const videoBackwardButtonRef = useRef();
  const videoForwardButtonRef = useRef();

  useEffect(() => {
    setCanvas(initCanvas);
    console.log(canvasRef);
  }, [show]);

  const initCanvas = () => {
    const canvi = new fabric.Canvas("canvas", {
      width: videoPlaceholderRef.current.offsetWidth,
      height: videoPlaceholderRef.current.offsetHeight,
      backgroundColor: "transparent"
    });

    const rect = new fabric.Rect({
      height: 100,
      width: 100,
      fill: "yellow",
    });
    canvi.add(rect);
    canvi.renderAll();
  };

  const toggleIsPlaying = () => {
    isPlaying ? setIsPlaying(false) : setIsPlaying(true);
  };

  const updateVideoTime = (skipInterval, e) => {
    const currentTime = videoPlayerRef.current.getCurrentTime();
    videoPlayerRef.current.seekTo(currentTime + skipInterval);
  };

  return (
    <div>
      <div>
        {show ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              visibility: "visible",
              zIndex: 1000,
            }}
          >
            <canvas id="canvas"/>
          </span>
        ) : null}
      </div>
      <div className={styles[`video-container`]}>
        <div className={`${styles[`video-placeholder-container`]}`}>
          <div id="video-size-check" ref={videoPlaceholderRef} className={`${styles[`video-placeholder`]}`}>
            <ReactPlayer
              className={styles[`video-player`]}
              url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              playing={isPlaying}
              ref={videoPlayerRef}
              width="100%"
              height="100%"
              onReady={() => {
                videoPlayerRef.current.forcePlay = () => {
                  setIsPlaying(true);
                };
              }}
              onPlay={() => {
                setIsPlaying(true);
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              onError={() => {
                setVideoState("unavailable");
              }}
              controls={true}
              playbackRate={playbackSpeed}
              config={{
                file: {
                  attributes: {
                    oncontextmenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                    crossOrigin: "anonymous",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles[`video-play-controller-container`]}>
          <div className={styles[`setting-container`]}>
            <Dropdown drop={"right"}>
              <Dropdown.Toggle variant={"white"} className={styles[`setting-toggle`]}>
                <img alt={`setting icon img`} className={styles[`setting-icon`]} src={`../../design/assets/slid_setting_icon.png`} />
                <span>Video Setting</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles[`setting-popup`]}>
                <div>
                  <span className={styles[`setting-title`]}>동영상 설정</span>
                </div>
                <div>
                  <div className={`${styles[`setting-option`]}`}>
                    <span>구간 이동 간격</span>
                    <select
                      className={`${styles[`select`]} custom-select custom-select-sm`}
                      value={skipInterval}
                      onChange={(event) => {
                        setSkipInterval(parseInt(event.target.value));
                      }}
                    >
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={30}>30s</option>
                      <option value={60}>60s</option>
                    </select>
                  </div>
                  <div className={`${styles[`setting-option`]}`}>
                    <span>재생속도</span>
                    <select
                      className={`${styles[`select`]} custom-select custom-select-sm`}
                      value={playbackSpeed}
                      onChange={(event) => {
                        setPlaybackSpeed(parseFloat(event.target.value));
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
          <div>
            <div className={styles[`control-container`]}>
              <OverlayTrigger placement={"top"} overlay={<Tooltip className={`shortcut-tooltip`}>{`${skipInterval}초 뒤로 (Alt + J)`}</Tooltip>}>
                <button
                  ref={videoBackwardButtonRef}
                  className={`${styles[`skip-btn`]} ${styles[`skip-backward-btn`]} btn btn-secondary`}
                  onClick={(e) => {
                    updateVideoTime(-skipInterval, e);
                  }}
                >
                  -{skipInterval} <img alt={`skip backward button`} className={`${styles[`skip-backward`]}`} src={`../../design/assets/slid_backward_white_icon.png`} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger placement={"top"} overlay={<Tooltip className={`shortcut-tooltip`}>{{ isPlaying } ? `일시정지 (Alt + K)` : `재생 (Alt + K)`}</Tooltip>}>
                <button className={`${styles[`play-btn`]} btn btn-light`} onClick={toggleIsPlaying}>
                  <img alt={`play pause button`} className={styles[`video-icon`]} src={`../../design/assets/slid_${isPlaying ? "pause" : "play"}_btn_icon.png`} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger placement={"top"} overlay={<Tooltip className={`shortcut-tooltip`}>{`${skipInterval}초 앞으로 (Alt + L)`}</Tooltip>}>
                <button
                  ref={videoForwardButtonRef}
                  className={`${styles[`skip-btn`]} ${styles[`skip-forward-btn`]} btn btn-secondary`}
                  onClick={(e) => {
                    updateVideoTime(skipInterval, e);
                  }}
                >
                  <img alt={`skip forward button`} className={`${styles[`skip-forward`]}`} src={`../../design/assets/slid_forward_white_icon.png`} />+{skipInterval}
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>

        {/* Video Stamp */}
      </div>

      <VideoCapture videoPlayerRef={videoPlayerRef} />
    </div>
  );
};

export default VideoPlayer;
