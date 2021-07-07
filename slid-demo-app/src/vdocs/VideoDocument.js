import React, { useState } from "react";
import Split from "react-split";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";
import "./VideoDocument.css";
import { withResizeDetector } from 'react-resize-detector';

const VideoPlayerSizeDetector = withResizeDetector(VideoPlayer);

const VideoDocument = (props) => {
  const { lang, isMacOs } = props;
  const [showSelectAreaCanvas, setShowSelectAreaCanvas] = useState(false);
  const [isCapturingOneClick, setIsCapturingOneClick] = useState(false);
  const [captureSelectArea, setCaptureSelectArea] = useState(false);
  const [selectAreaCoordinate, setSelectAreaCoordinate] = useState({
    left: "",
    top: "",
    width: "",
    height: "",
  });
  const [captureImgUrl, setCaptureImgUrl] = useState("");

  return (
    <div className={`${styles[`vdocs-container`]}`}>
      <Split
        className={`${styles[`split-wrapper`]} d-flex`}
        sizes={[60, 40]}
        minSize={[580, 330]}
        expandToMin={false}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <VideoPlayerSizeDetector
          captureSelectArea={captureSelectArea}
          showSelectAreaCanvas={showSelectAreaCanvas}
          isCapturingOneClick={isCapturingOneClick}
          setIsCapturingOneClick={setIsCapturingOneClick}
          setSelectAreaCoordinate={setSelectAreaCoordinate}
          setCaptureImgUrl={setCaptureImgUrl}
          lang={lang}
          isMacOs={isMacOs}
          selectAreaCoordinate={selectAreaCoordinate}
        />
        <VideoDocumentEditor
          selectAreaCoordinate={selectAreaCoordinate}
          captureImgUrl={captureImgUrl}
          setSelectAreaCoordinate={setSelectAreaCoordinate}
          setShowSelectAreaCanvas={setShowSelectAreaCanvas}
          setIsCapturingOneClick={setIsCapturingOneClick}
          setCaptureSelectArea={setCaptureSelectArea}
          setCaptureImgUrl={setCaptureImgUrl}
        />
      </Split>
    </div>
  );
};

export default VideoDocument;
