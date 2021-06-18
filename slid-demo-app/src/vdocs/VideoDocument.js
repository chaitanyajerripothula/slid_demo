import React from "react";
import SplitPane from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";
import styles from "./VideoDocument.module.css"

const VideoDocument = () => {
  return (
    <div className={`${styles[`vdocs-container`]}`}>
      <SplitPane
            className={`${styles[`split-wrapper`]}`} 
            sizes={[60, 40]} minSize={[(580, 330)]} expandToMin={false}
            gutterAlign="center" snapOffset={30} dragInterval={1}
            direction="horizontal" cursor="col-resize">
        <VideoPlayer />
        <VideoDocumentEditor />
      </SplitPane>
    </div>
  );
};

export default VideoDocument;
