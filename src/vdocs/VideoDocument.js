import React from "react";
import Split from "react-split";
import VideoPlayer from "./VideoPlayer";
import VideoDocumentEditor from "./VideoDocumentEditor";

class VideoDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
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
          <VideoPlayer />
          <VideoDocumentEditor />
        </Split>
      </div>
    );
  }
}

const actions = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, actions)(VideoDocument);
