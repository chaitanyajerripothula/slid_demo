import "./index.css";
import Tunes from "./tunes";

export default class ImageTool {
  static get isReadOnlySupported() {
    return true;
  }

  // static get toolbox() {
  //   return {
  //     icon: `
  //      <svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150.242V79c0-18.778-15.222-34-34-34H79c-18.778 0-34 15.222-34 34v42.264l67.179-44.192 80.398 71.614 56.686-29.14L291 150.242zm-.345 51.622l-42.3-30.246-56.3 29.884-80.773-66.925L45 174.187V197c0 18.778 15.222 34 34 34h178c17.126 0 31.295-12.663 33.655-29.136zM79 0h178c43.63 0 79 35.37 79 79v118c0 43.63-35.37 79-79 79H79c-43.63 0-79-35.37-79-79V79C0 35.37 35.37 0 79 0z"/></svg>
  //     `,
  //     title: 'Image',
  //   };
  // }

  constructor({ data, config, api, readOnly, block }) {
    this.data = data;
    this.config = config;
    this.api = api;
    this.readOnly = readOnly;
    this.block = block;

    this.tunes = new Tunes({
      api,
      actions: this.config.actions,
      onChange: (tuneName) => this.tuneToggled(tuneName),
    });
  }

  async updateImageBlock(img) {
    const clipData = await this.data.setClipData();

    if (clipData) {
      this.data = clipData;
      img.onload = null;
      img.src = this.data.src;

      this.config.saveDocument();
    } else {
      // TODO show error
    }
  }

  render() {
    if (this.data.type === "manualCapture" && !(this.data.rawSrc || this.data.src)) return this.destroy();

    this.wrapper = document.createElement("div");
    this.wrapper.draggable = true;
    this.wrapper.className = `cdx-block image-block`;

    const img = document.createElement("img");
    img.setAttribute("blocktype", "image");
    img.draggable = true;
    if (this.data.rawSrc) {
      img.src = this.data.rawSrc;
      img.onload = async (event) => {
        this.updateImageBlock(event.target);
      };
    } else {
      if (this.data.markupImgSrc) {
        img.src = this.data.markupImgSrc;
      } else {
        img.src = this.data.src;
      }
    }
    img.alt = "screen captures";
    img.addEventListener("click", () => {
      if (this.readOnly) {
        if (this.data.timestamp) {
          this.config.onClickPlayVideoFromTs({
            clipVideoKey: this.data.videoInfo.videoKey,
            clipTs: this.data.timestamp,
          });
        }
      } else {
        this.config.onClickImage();
      }
    });

    this.wrapper.appendChild(img);

    return this.wrapper;
  }

  save() {
    return {
      clipKey: this.data.clipKey,
      documentKey: this.data.documentKey,
      timestamp: this.data.timestamp,
      src: this.data.src,
      videoInfo: this.data.videoInfo,
      type: this.data.type,
      markupImgSrc: this.data.markupImgSrc,
      markupCanvasData: this.data.markupCanvasData,
    };
  }

  moved(event) {
    const currentScrollTop = document.getElementById("editor-container").scrollTop;
    const changedHeight = this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex()).holder.offsetHeight;
    if (event.detail.fromIndex < event.detail.toIndex) {
      document.getElementById("editor-container").scrollTop = currentScrollTop + changedHeight;
    } else {
      document.getElementById("editor-container").scrollTop = currentScrollTop - changedHeight;
    }
  }

  renderSettings() {
    const wrapper = [];

    let settings = [];

    settings.push({
      name: "markup",
      icon: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.68333 17.1492C3.44956 17.1488 3.22672 17.0502 3.06916 16.8775C2.9087 16.7062 2.82896 16.4746 2.84999 16.2408L3.05416 13.9958L12.4858 4.5675L15.4333 7.51417L6.00416 16.9417L3.75916 17.1458C3.73333 17.1483 3.70749 17.1492 3.68333 17.1492ZM16.0217 6.925L13.075 3.97834L14.8425 2.21084C14.9988 2.05436 15.2109 1.96643 15.4321 1.96643C15.6533 1.96643 15.8654 2.05436 16.0217 2.21084L17.7892 3.97834C17.9456 4.13464 18.0336 4.34675 18.0336 4.56792C18.0336 4.78909 17.9456 5.0012 17.7892 5.1575L16.0225 6.92417L16.0217 6.925Z" fill="#2E3A59"/>
          </svg>        
        `,
      title: this.config.lang === "ko" ? "펜 필기" : "Annotate",
      click: () => {
        this.config.onClickMarkup({
          src: this.data.src,
          markupImgSrc: this.data.markupImgSrc,
          clipKey: this.data.clipKey,
          blockIndex: this.api.blocks.getCurrentBlockIndex(),
          markupCanvasData: this.data.markupCanvasData,
        });
      },
    });

    if (this.data.clipKey) {
      settings.push({
        name: "ocr",
        icon: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18.3333H5.00004C4.07957 18.3333 3.33337 17.5871 3.33337 16.6666V3.3333C3.33337 2.41283 4.07957 1.66663 5.00004 1.66663H10.8334C11.0545 1.66585 11.2668 1.75381 11.4225 1.9108L16.4225 6.9108C16.5795 7.06658 16.6675 7.27881 16.6667 7.49996V16.6666C16.6667 17.5871 15.9205 18.3333 15 18.3333ZM5.00004 3.3333V16.6666H13.8217L11.6834 14.5283C11.1752 14.8347 10.5935 14.9977 10 15C8.46771 15.0166 7.11712 13.9972 6.71292 12.5191C6.30872 11.0409 6.95269 9.47615 8.28025 8.7107C9.6078 7.94525 11.2846 8.17185 12.3614 9.2622C13.4382 10.3526 13.6437 12.0321 12.8617 13.35L15 15.49V7.84497L10.4884 3.3333H5.00004ZM10 9.99997C9.07957 9.99997 8.33337 10.7462 8.33337 11.6666C8.33337 12.5871 9.07957 13.3333 10 13.3333C10.9205 13.3333 11.6667 12.5871 11.6667 11.6666C11.6667 10.7462 10.9205 9.99997 10 9.99997Z" fill="#2E3A59"/>
            </svg>        
          `,
        title: this.config.lang === "ko" ? "텍스트 추출" : "Grab text",
        click: () => {
          this.config.onClickOcr({
            clipKey: this.data.clipKey,
            blockIndex: this.api.blocks.getCurrentBlockIndex(),
          });
        },
      });
    }

    if (this.data.timestamp !== undefined) {
      settings.push({
        name: "play",
        icon: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99996 18.3333C5.39968 18.3283 1.67168 14.6003 1.66663 9.99997V9.83331C1.75824 5.25375 5.52878 1.6066 10.1089 1.66737C14.6889 1.72814 18.3614 5.47405 18.3314 10.0544C18.3015 14.6348 14.5804 18.3324 9.99996 18.3333ZM8.33329 6.24997V13.75L13.3333 9.99997L8.33329 6.24997Z" fill="#2E3A59"/>
            </svg>        
          `,
        // TODO remove tooltip on click
        // title: this.config.lang === "ko" ? "여기부터 재생" : "Play here",
        click: () => {
          this.config.onClickPlayVideoFromTs({
            clipVideoKey: this.data.videoInfo.videoKey,
            clipTs: this.data.timestamp,
            videoInfo: this.data.videoInfo,
          });
        },
      });
    }

    settings.forEach((tune) => {
      let button = document.createElement("div");

      button.classList.add("cdx-settings-button");
      button.innerHTML = tune.icon;
      button.addEventListener("click", tune.click.bind(this));

      if (tune.title) {
        this.api.tooltip.onHover(button, tune.title, {
          placement: "top",
        });
      }

      wrapper.push(button);
    });

    return wrapper;
  }

  /**
   * Specify paste substitutes
   *
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @returns {{tags: string[], patterns: object<string, RegExp>, files: {extensions: string[], mimeTypes: string[]}}}
   */
  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */
      // tags: ["img"],

      /**
       * Paste URL of image into the Editor
       */
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i,
      },

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["image/*"],
      },
    };
  }

  /**
   * Specify paste handlers
   *
   * @public
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param {CustomEvent} event - editor.js custom paste event
   *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   * @returns {void}
   */
  onPaste(event) {
    switch (event.type) {
      case "tag": {
        // if block is pasted
        if (event.detail.data.hasAttribute("blocktype")) {
          switch (event.detail.data.getAttribute("blocktype")) {
            case "image":
              this.config.onDragAndDropImageBlock({
                currentSrc: event.detail.data.currentSrc,
              });
              return;
            default:
              this.api.blocks.delete();
              return;
          }

          // just img tag is pasted
        } else {
          this.api.blocks.delete();
          return;
        }
      }
      case "pattern": {
        const url = event.detail.data;
        this.config.onPasteImageUrl({
          url: url,
          blockIndex: this.api.blocks.getCurrentBlockIndex(),
        });
        this.api.blocks.delete();

        break;
      }
      case "file": {
        const file = event.detail.file;
        this.config.onPasteFile({
          file: file,
          blockIndex: this.api.blocks.getCurrentBlockIndex(),
        });
        this.api.blocks.delete();
        break;
      }
    }
  }

  tuneToggled(tuneName) {}
}
