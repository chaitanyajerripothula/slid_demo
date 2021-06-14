import React from "react";
import SplitPane from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";

const VideoDocument = () => {
  return (
    <div>
      <SplitPane sizes={[60, 40]} minSize={[(580, 330)]} expandToMin={false}
             gutterAlign="center" snapOffset={30} dragInterval={1}
             direction="horizontal" cursor="col-resize">
        <VideoPlayer />
        <VideoDocumentEditor />
      </SplitPane>
    </div>
  );
};

export default VideoDocument;
