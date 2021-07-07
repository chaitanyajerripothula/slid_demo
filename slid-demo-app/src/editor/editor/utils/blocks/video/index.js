import "./index.css";

export default class VideoTool {
  constructor({ data, config, api, readOnly, block }) {
    this.data = data;
    this.config = config;

    this.wrapper = undefined;
  }

  save() {
    return {
      videoUrl: this.data.videoUrl,
      posterUrl: this.data.posterUrl,
    };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = `cdx-block video-block`;

    const video = document.createElement("video");
    video.setAttribute("blocktype", "video");
    video.setAttribute("preload", "auto");

    video.draggable = true;
    video.contentEditable = false;
    if (this.data.videoUrl) {
      video.src = this.data.videoUrl;
    }

    video.addEventListener("mouseenter", () => {
      video.setAttribute("controls", "true");
    });

    video.addEventListener("mouseout", () => {
      video.removeAttribute("controls");
    });

    video.addEventListener("click", () => {
      this.config.onClickVideo();
    });

    video.addEventListener("seeking", () => {
      video.draggable = false;
    });

    video.addEventListener("seeked", () => {
      setTimeout(() => {
        video.draggable = true;
      }, 100);
    });

    // only text selections, images, and links can be dragged.
    // For other elements, the event ondragstart must be set for drag and drop to work.
    // So I add meaningless ondragstart code to video.
    video.ondragstart = (event) => {
      event.dataTransfer.setData("text/plain", "");
    };

    this.wrapper.appendChild(video);

    return this.wrapper;
  }

  static get isReadOnlySupported() {
    return true;
  }
}
