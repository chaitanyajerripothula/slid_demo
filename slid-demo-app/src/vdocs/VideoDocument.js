import React, { useState } from "react";
import Split from 'react-split';
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";
import './VideoDocument.css'

const VideoDocument = (props) => {
  const {lang, isMacOs} = props;
  const [showSelectAreaCanvas, setShowSelectAreaCanvas] = useState(false);
  const [isCapturingOneClick, setIsCapturingOneClick] = useState(false);
  const [captureSelectArea, setCaptureSelectArea] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState('');

  return (
    <div className={`${styles[`vdocs-container`]}`}>
      <Split
        className={`${styles[`split-wrapper`]} d-flex`}
        sizes={[60, 40]}
        minSize={[580, 330]}
        // maxSize={[1260,708]}
        expandToMin={false}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <VideoPlayer captureSelectArea={captureSelectArea} showSelectAreaCanvas={showSelectAreaCanvas} isCapturingOneClick={isCapturingOneClick} setIsCapturingOneClick={setIsCapturingOneClick} lang={lang} isMacOs={isMacOs} setCapturedImageUrl={setCapturedImageUrl} />
        <VideoDocumentEditor setShowSelectAreaCanvas={setShowSelectAreaCanvas} setIsCapturingOneClick={setIsCapturingOneClick} setCaptureSelectArea={setCaptureSelectArea} capturedImageUrl={capturedImageUrl}/>
      </Split>
    </div>
  );
};

export default VideoDocument;
