import React from "react";
import Split from "react-split-pane";
import VideoPlayer from "../vdocs/VideoPlayer";
import VideoDocumentEditor from "../vdocs/VideoDocumentEditor";

const VideoDocument = () => {
  return (
    <div>
      <Split sizes={[60, 40]} minSize={[(580, 330)]} expandToMin={false} gutterAlign="center" snapOffs et={30} dragInterval={1} direction="horizontal" cursor="col-resize">
        <VideoPlayer />
        <VideoDocumentEditor />
      </Split>
    </div>
  );
};

export default VideoDocument;
