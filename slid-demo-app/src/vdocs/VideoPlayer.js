import React, { useRef, useState } from 'react';
import ReactPlayer from "react-player";
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState();
  const [videoState, setVideoState] = useState("empty");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [skipInterval, setSkipInterval] = useState(5);

  const videoPlayerRef = useRef();
  const videoPlaceholderRef = useRef()
  const videoBackwardButtonRef = useRef();
  const videoForwardButtonRef = useRef();

  const toggleIsPlaying = () => {
    isPlaying ? setIsPlaying(false) : setIsPlaying(true);
  }

  const updateVideoTime = (skipInterval, e) => {
    const currentTime = videoPlayerRef.current.getCurrentTime()
    videoPlayerRef.current.seekTo(currentTime + skipInterval);
  }

  return (
    <div>
      <div>
        <div ref={videoPlaceholderRef}>
          <ReactPlayer
            url="https://vimeo.com/1084537"
            playing={isPlaying}
            ref={videoPlayerRef}
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
                },},}} />
        </div>
      </div>

      <div>
        <div>
          <Dropdown drop={'right'}>
            <Dropdown.Toggle variant={'white'}>
              <span>Video Setting</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div>
                <span>동영상 설정</span>
              </div>
              <div>
                <div>
                  <span>구간 이동 간격</span>
                  <select
                    value={skipInterval}
                    onChange={(event) => {
                      setSkipInterval(parseInt(event.target.value));
                    }}>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>
                <div>
                  <span>재생속도</span>
                  <select
                    value={playbackSpeed}
                    onChange={(event) => {
                      setPlaybackSpeed(parseFloat(event.target.value))
                    }}>
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
          <div>
            <OverlayTrigger
              placement={'top'}
              overlay={
                <Tooltip>
                  {`${skipInterval}초 뒤로 (Alt + J)`}
                </Tooltip>
              }>
              <button
                ref={videoBackwardButtonRef}
                onClick={(e)=>{updateVideoTime(-skipInterval, e)}}>
                  -{skipInterval}{" "}
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement={'top'}
              overlay={
                <Tooltip>
                  {{isPlaying} ? `일시정지 (Alt + K)` : `재생 (Alt + K)`}
                </Tooltip>
              }>
              <button onClick={toggleIsPlaying}></button>
            </OverlayTrigger>

            <OverlayTrigger
              placement={'top'}
              overlay={
                <Tooltip>
                  {`${skipInterval}초 앞으로 (Alt + L)`}
                </Tooltip>
              }>
              <button
                ref={videoForwardButtonRef}
                onClick={(e)=>{updateVideoTime(skipInterval, e)}}>
                  +{skipInterval}
              </button>
            </OverlayTrigger>

          </div>
        </div>
      </div>

      {/* Video Stamp */}

    </div>
  );
};

export default VideoPlayer;
