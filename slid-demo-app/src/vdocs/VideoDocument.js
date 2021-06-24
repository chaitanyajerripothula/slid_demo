import React, { useState, useRef } from "react";
import SplitPane from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";

const VideoDocument = () => {
  const [show, setShow] = useState(false);
  const [captureBtnClicked, setCaptureBtnClicked] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const slidDoc = useRef();

  const handleClose = () => {
    console.log("handleClose");
    setShow(false);
  };
  const handleShow = () => {
    console.log("handleShow");
    setShow(true);
  };

  const setFullScreen = () => {
    if(isFullScreen) {
      slidDoc.current.exitFullscreen();
      setIsFullScreen(false);
      console.log("작게");
    }
    else {
      slidDoc.current.requestFullscreen();
      setIsFullScreen(true);
      console.log("크게");
    }
  }

  const fullImageCapture = () => {
    setCaptureBtnClicked(true);
  }

  return (
    <div className={`${styles[`vdocs-container`]}`} id="slidDocument" ref={slidDoc}>
      <SplitPane
        className={`${styles[`split-wrapper`]}`}
        sizes={[60, 40]}
        minSize={[(580, 330)]}
        expandToMin={false}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <VideoPlayer show={show} isFullScreen={isFullScreen} setFullScreen={setFullScreen} captureBtnClicked={captureBtnClicked} />
        <VideoDocumentEditor show={show} handleClose={handleClose} handleShow={handleShow} fullImageCapture={fullImageCapture}/>
      </SplitPane>
    </div>
  );
};

export default VideoDocument;
