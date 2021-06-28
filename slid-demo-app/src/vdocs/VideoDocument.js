import React, { useState, useRef } from "react";
import SplitPane from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";

const VideoDocument = () => {
  const [show, setShow] = useState(false);
  const [capture, setCapture] = useState(false);

  const handleClose = () => {
    console.log("handleClose");
    setShow(false);
  };

  const handleCaptureOn = () => {
    console.log("handleCaptureOn");
    setCapture(true);
  };

  const handleCaptureOff = () => {
    setCapture(false);
  };

  const handleShow = () => {
    console.log("handleShow");
    setShow(true);
  };

  return (
    <div className={`${styles[`vdocs-container`]}`}>
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
        <VideoPlayer show={show} capture={capture} handleCaptureOff={handleCaptureOff} />
        <VideoDocumentEditor show={show} handleClose={handleClose} handleShow={handleShow} handleCaptureOn={handleCaptureOn} />
      </SplitPane>
    </div>
  );
};

export default VideoDocument;
