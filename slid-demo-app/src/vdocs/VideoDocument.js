import React, { useState } from "react";
import Split from "react-split";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";
import "./VideoDocument.css";

const VideoDocument = (props) => {
  const { lang, isMacOs } = props;
  const [showSelectAreaCanvas, setShowSelectAreaCanvas] = useState(false);
  const [isCapturingFullScreen, setIsCapturingFullScreen] = useState(false);
  const [captureSelectArea, setCaptureSelectArea] = useState(false);

  return (
    <div className={`${styles[`vdocs-container`]}`}>
      <Split
        className={`${styles[`split-wrapper`]} d-flex`}
        sizes={[60, 40]}
        minSize={[(580, 330)]}
        expandToMin={false}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <VideoPlayer
          captureSelectArea={captureSelectArea}
          showSelectAreaCanvas={showSelectAreaCanvas}
          isCapturingFullScreen={isCapturingFullScreen}
          setIsCapturingFullScreen={setIsCapturingFullScreen}
          lang={lang}
          isMacOs={isMacOs}
        />
        <VideoDocumentEditor
          setShowSelectAreaCanvas={setShowSelectAreaCanvas}
          setIsCapturingFullScreen={setIsCapturingFullScreen}
          setCaptureSelectArea={setCaptureSelectArea}
          lang={lang}
          isMacOs={isMacOs}
        />
      </Split>
    </div>
  );
};

export default VideoDocument;
