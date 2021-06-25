import React, { useState, useRef } from "react";
import SplitPane from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css";

const VideoDocument = (props) => {
  const {lang, isMacOs} = props;
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
      console.log("작게");
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
    else {
      console.log("크게");
      if (slidDoc.current.requestFullscreen) {
        slidDoc.current.requestFullscreen();
      } else if (slidDoc.current.mozRequestFullScreen) {
        slidDoc.current.mozRequestFullScreen();
      } else if (slidDoc.current.webkitRequestFullscreen) {
        slidDoc.current.webkitRequestFullscreen();
      } else if (slidDoc.current.msRequestFullscreen) {
        slidDoc.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    }
  }

  const fullImageCapture = () => {
    captureBtnClicked ? (setCaptureBtnClicked(false)) : (setCaptureBtnClicked(true));
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
        <VideoPlayer show={show} isFullScreen={isFullScreen} setFullScreen={setFullScreen} captureBtnClicked={captureBtnClicked} fullImageCapture={fullImageCapture} lang={lang} isMacOs={isMacOs}/>
        <VideoDocumentEditor show={show} handleClose={handleClose} handleShow={handleShow} fullImageCapture={fullImageCapture} />
      </SplitPane>
    </div>
  );
};

export default VideoDocument;
