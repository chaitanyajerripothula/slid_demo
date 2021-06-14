import env from "../../env";
import { v4 as uuidv4 } from "uuid";
import * as Sentry from "@sentry/browser";

import { sendAmplitudeData } from "../amplitude";

import { ServerInterface_registerClip, ServerInterface_deleteClip, ServerInterface_registerClipOCR, ServerInterface_getClipOCRResults } from "../serverInterface";

import Swal from "sweetalert2";

function isIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

class SlidImageBlock {
  constructor({ data, api, config, readOnly, block }) {
    this.api = api;
    this.readOnly = readOnly;

    this.imgBase64 = data.imgBase64;
    this.imgUrl = data.src;
    this.timestamp = data.timestamp;
    this.videoInfo = data.videoInfo ? data.videoInfo : {};
    this.documentKey = data.documentKey;
    this.clipKey = data.clipKey;
    this.deleteIntervalId = data.deleteIntervalId;
    this.markupImgSrc = data.markupImgSrc;

    this.accessToken = config.accessToken;
    this.Storage = config.AwsStorage;
    this.onEditorUpdate = config.onEditorUpdate;
    this.checkIfDocumentIsNewlyRendered = config.checkIfDocumentIsNewlyRendered;
    this.insertNewParagraph = config.insertNewParagraph;
    this.onClickImgMarkup = config.onClickImgMarkup;
    this.seekToTimestamp = config.seekToTimestamp;
    this.isVdocs = config.isVdocs;
    this.lang = config.lang;
    this.startLoadingPopup = config.startLoadingPopup;
    this.closePopup = config.closePopup;
    this.config = config;

    this.uploadToStorage = this.uploadToStorage.bind(this);

    this.block = block;
  }

  static get isReadOnlySupported() {
    return true;
  }

  //Base64 to formfile
  urltoFile(url, filename, mimeType) {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  async uploadImageToStorage({ file, format, resultCallBack }) {
    this.Storage.put("image_upload/" + this.config.documentKey + "/" + uuidv4() + "." + format, file, {
      contentType: file.type,
      ACL: "public-read",
    })
      .then(async (result) => {
        resultCallBack(result);
      })
      .catch((err) => {
        console.log(`Cannot uploading file: ${err}`);
      });
  }

  async uploadToStorage(e) {
    if (!this.documentKey) return;

    var target = e.target;

    if (target.getAttribute("data-uploaded") == "false") {
      let file = await this.urltoFile(this.imgBase64, uuidv4() + ".png");
      this.Storage.put("capture_images/" + file.name, file, {
        ContentEncoding: "base64",
        contentType: "image/png",
        ACL: "public-read",
      })
        .then(async (result) => {
          target.src = env[env["env"]]["end_point_url"]["aws_capture_s3"] + result.key;
          target.setAttribute("data-uploaded", true);

          this.imgUrl = target.src;
          if (this.videoInfo) delete this.videoInfo.captureImgBase64;

          const registeredClip = await ServerInterface_registerClip({
            accessToken: this.accessToken,
            data: {
              img_src: this.imgUrl,
              clip_ts: this.timestamp,
              document_key: this.documentKey,
              video_key: this.videoInfo.videoKey,
            },
          });

          if (!registeredClip) {
            Sentry.withScope((scope) => {
              scope.setExtra("this.documentKey", this.documentKey);
              scope.setExtra("this.videoInfo.videoKey", this.videoInfo.videoKey);
              scope.setLevel("info");
              Sentry.captureMessage("SLID_WEB_CLIP_REGISTER_ERROR");
            });
          }

          this.clipKey = registeredClip.clip_key;
          target.id = this.clipKey;

          this.onEditorUpdate(true);

          const previousScrollTop = document.querySelector(".document-component-wrapper").scrollTop;
          target.parentElement.parentElement.scrollIntoView();
          if (previousScrollTop !== document.querySelector(".document-component-wrapper").scrollTop)
            document.querySelector(".document-component-wrapper").scrollTop = document.querySelector(".document-component-wrapper").scrollTop - 200;

          Array.from(document.querySelectorAll(".ce-block--selected")).forEach((selectedElement) => {
            selectedElement.className = selectedElement.className.replace("ce-block--selected", "");
          });

          this.api.blocks.insert(
            "paragraph",
            {
              text: "",
            },
            {},
            undefined,
            true
          );
          this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
        })
        .catch((err) => {
          console.log(`Cannot uploading file: ${err}`);
        });
    } else {
      if (target.naturalWidth >= target.naturalHeight) {
        target.className = target.className + " landscape";
      } else {
        target.className = target.className + " portrait";
      }
    }
  }

  moved(event) {
    if (event.detail.fromIndex < event.detail.toIndex) {
      if (this.wrapper) this.wrapper.scrollIntoView(false);
    } else {
      if (this.wrapper) this.wrapper.scrollIntoView(true);
      document.querySelector(".document-component-wrapper").scrollTop = document.querySelector(".document-component-wrapper").scrollTop - 100;
    }
  }

  renderSettings() {
    const settings = [
      {
        name: "markup",
        icon: `
                <svg class="markup-setting-btn" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="highlighter" class="svg-inline--fa fa-highlighter fa-w-17 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512" style="width: 20px; color: rgb(139, 224, 2);">

                <title>${this.lang === "ko" ? "이미지 위 드로잉" : "Image markup"}</title>
                <path fill="currentColor" d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"></path></svg>
                
                `,
        click: () => {
          this.onClickImgMarkup({
            imgSrc: this.imgUrl,
            imgBlockIndex: this.api.blocks.getCurrentBlockIndex(),
            markupImgSrc: this.markupImgSrc,
          });

          sendAmplitudeData(`SLID_1_OPEN_IMG_MARKUP`);
        },
      },

      {
        name: "ocr",
        icon: `	<svg class="ocr-setting-btn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20pt" height="20pt" viewBox="0 0 20 20" version="1.1">
                
                    <title>${this.lang === "ko" ? "텍스트 추출" : "Text extract"}</title>        
                <g id="surface1">
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.761719 2.65625 L 0.761719 4.550781 L 2.273438 4.550781 L 2.273438 2.273438 L 4.550781 2.273438 L 4.550781 0.761719 L 0.761719 0.761719 Z M 0.761719 2.65625 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 15.148438 1.519531 L 15.148438 2.273438 L 17.425781 2.273438 L 17.425781 4.550781 L 18.9375 4.550781 L 18.9375 0.761719 L 15.148438 0.761719 Z M 15.148438 1.519531 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 3.625 6.828125 C 2.679688 6.890625 1.84375 7.578125 1.59375 8.5 C 1.519531 8.773438 1.519531 8.78125 1.515625 9.757812 C 1.511719 10.867188 1.519531 10.984375 1.640625 11.332031 C 1.753906 11.667969 1.925781 11.945312 2.183594 12.203125 C 2.613281 12.636719 3.179688 12.875 3.789062 12.875 C 4.902344 12.875 5.847656 12.066406 6.035156 10.953125 C 6.054688 10.832031 6.054688 10.726562 6.054688 9.855469 C 6.054688 8.8125 6.054688 8.792969 5.984375 8.527344 C 5.773438 7.695312 5.078125 7.035156 4.230469 6.863281 C 4.121094 6.839844 4.0625 6.835938 3.832031 6.820312 C 3.796875 6.820312 3.703125 6.820312 3.625 6.828125 Z M 3.96875 8.355469 C 4.261719 8.429688 4.480469 8.667969 4.53125 8.964844 C 4.5625 9.132812 4.550781 10.699219 4.519531 10.800781 C 4.402344 11.191406 4.039062 11.421875 3.640625 11.347656 C 3.601562 11.34375 3.515625 11.3125 3.453125 11.28125 C 3.21875 11.167969 3.074219 10.957031 3.035156 10.691406 C 3.027344 10.628906 3.023438 10.296875 3.027344 9.78125 C 3.03125 9.046875 3.035156 8.960938 3.054688 8.894531 C 3.132812 8.632812 3.34375 8.421875 3.601562 8.359375 C 3.691406 8.332031 3.875 8.332031 3.96875 8.355469 Z M 3.96875 8.355469 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 9.6875 6.828125 C 9.414062 6.84375 9.101562 6.929688 8.847656 7.054688 C 8.144531 7.410156 7.671875 8.082031 7.589844 8.863281 C 7.570312 9.027344 7.570312 10.652344 7.585938 10.828125 C 7.703125 11.980469 8.683594 12.875 9.835938 12.875 C 10.175781 12.875 10.457031 12.816406 10.765625 12.679688 C 11.164062 12.507812 11.539062 12.179688 11.769531 11.804688 C 11.914062 11.578125 12.023438 11.308594 12.074219 11.054688 C 12.105469 10.902344 12.132812 10.625 12.113281 10.609375 C 12.109375 10.605469 11.765625 10.601562 11.355469 10.601562 L 10.605469 10.605469 L 10.597656 10.691406 C 10.5625 11.054688 10.265625 11.335938 9.894531 11.359375 C 9.53125 11.378906 9.226562 11.164062 9.117188 10.804688 C 9.09375 10.734375 9.09375 10.671875 9.09375 9.851562 C 9.09375 9.03125 9.09375 8.964844 9.117188 8.894531 C 9.183594 8.671875 9.324219 8.507812 9.515625 8.414062 C 9.640625 8.355469 9.714844 8.335938 9.855469 8.335938 C 10.054688 8.335938 10.234375 8.410156 10.382812 8.554688 C 10.511719 8.6875 10.601562 8.875 10.601562 9.027344 L 10.601562 9.085938 L 11.363281 9.085938 C 11.964844 9.085938 12.125 9.082031 12.125 9.070312 C 12.125 9.0625 12.117188 8.988281 12.109375 8.90625 C 12.050781 8.222656 11.683594 7.59375 11.113281 7.210938 C 10.867188 7.046875 10.570312 6.917969 10.292969 6.863281 C 10.183594 6.839844 10.121094 6.835938 9.894531 6.820312 C 9.859375 6.820312 9.765625 6.820312 9.6875 6.828125 Z M 9.6875 6.828125 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 13.636719 9.84375 L 13.636719 12.875 L 15.148438 12.875 L 15.148438 11.363281 L 15.578125 11.359375 C 15.8125 11.355469 16.015625 11.351562 16.027344 11.347656 C 16.046875 11.34375 16.097656 11.453125 16.359375 12.109375 L 16.664062 12.875 L 17.421875 12.875 C 18.136719 12.875 18.175781 12.875 18.171875 12.851562 C 18.167969 12.839844 17.980469 12.386719 17.757812 11.839844 L 17.355469 10.847656 L 17.519531 10.683594 C 17.914062 10.285156 18.136719 9.796875 18.171875 9.242188 C 18.214844 8.636719 18.003906 8.03125 17.601562 7.582031 C 17.265625 7.210938 16.824219 6.957031 16.347656 6.863281 C 16.132812 6.820312 15.917969 6.8125 14.753906 6.8125 L 13.636719 6.8125 Z M 16.121094 8.367188 C 16.296875 8.417969 16.445312 8.527344 16.546875 8.6875 C 16.621094 8.796875 16.652344 8.894531 16.660156 9.039062 C 16.667969 9.195312 16.648438 9.289062 16.585938 9.425781 C 16.5 9.605469 16.339844 9.742188 16.136719 9.8125 C 16.058594 9.84375 16.039062 9.84375 15.605469 9.847656 L 15.148438 9.851562 L 15.148438 8.335938 L 15.585938 8.335938 C 16.003906 8.335938 16.027344 8.339844 16.121094 8.367188 Z M 16.121094 8.367188 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.761719 17.042969 L 0.761719 18.9375 L 4.550781 18.9375 L 4.550781 17.425781 L 2.273438 17.425781 L 2.273438 15.148438 L 0.761719 15.148438 Z M 0.761719 17.042969 "/>
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 17.425781 16.289062 L 17.425781 17.425781 L 15.148438 17.425781 L 15.148438 18.9375 L 18.9375 18.9375 L 18.9375 15.148438 L 17.425781 15.148438 Z M 17.425781 16.289062 "/>
                        </g>
                        </svg>
                `,
        click: async () => {
          this.startLoadingPopup();

          const registerClipOCRResponse = await ServerInterface_registerClipOCR({
            accessToken: this.accessToken,
            data: {
              clip_key: this.clipKey,
              document_key: this.documentKey,
              video_key: this.videoInfo ? this.videoInfo.videoKey : null,
              img_src: this.imgUrl,
            },
          });

          if (!registerClipOCRResponse.clip_key) {
            Sentry.withScope((scope) => {
              scope.setExtra("this.imgUrl", this.imgUrl);
              scope.setLevel("error");
              Sentry.captureMessage("SLID_WEB_CLIP_OCR_REGISTER_ERROR");
            });

            this.closePopup();

            return alert(this.lang === "ko" ? "앗! 에러가 발생했습니다. 잠시 후에 다시 시도해주시거나 채팅 문의로 연락주세요." : "Something went wrong! Please try again later or contact us.");
          }

          const registerClipOCRKey = registerClipOCRResponse.clip_key;

          this.clipOcrGetIntervalId = setInterval(async () => {
            const clipOcrGetResult = await ServerInterface_getClipOCRResults({
              accessToken: this.accessToken,
              clip_key: registerClipOCRKey,
            });

            if (!clipOcrGetResult.status) {
              clearInterval(this.clipOcrGetIntervalId);

              Sentry.withScope((scope) => {
                scope.setExtra("this.imgUrl", registerClipOCRKey);
                scope.setLevel("error");
                Sentry.captureMessage("SLID_WEB_CLIP_OCR_GET_ERROR");
              });

              this.closePopup();

              return alert(this.lang === "ko" ? "앗! 에러가 발생했습니다. 잠시 후에 다시 시도해주시거나 채팅 문의로 연락주세요." : "Something went wrong! Please try again later or contact us.");
            }

            if (clipOcrGetResult.status === "done") {
              let isMembership;

              if (this.config.isCognitoUser && this.config.cognitoUserData && this.config.cognitoUserData.payment !== "free") {
                isMembership = true;
              } else {
                isMembership = false;
              }

              if (!isMembership) {
                Swal.fire({
                  target: `.Document-Component`,
                  customClass: {
                    container: "position-absolute",
                  },
                  title: this.config.lang === "ko" ? "회원권 전용 기능" : "Only for premium",
                  html:
                    this.config.lang === "ko"
                      ? `
                                            이미지 텍스트 추출은 회원 전용 기능으로, <br/>
                                            샘플 텍스트 일부만 추출되었습니다. <br/>
                                            회원권을 구입해 무제한으로 마음껏 이용하세요. :)
                                        `
                      : `
                                            Text grab(OCR) is only for premium plan, <br/>
                                            So only some of the sample text are grabbed. <br/>
                                            Get premium plan to unlock the full feature.
                                        `,
                  icon: "info",
                  confirmButtonText: this.config.lang === "ko" ? "회원권 보기" : "Get Premium",
                  cancelButtonText: this.config.lang === "ko" ? "닫기" : "Close",
                  showCancelButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    if (isIframe()) {
                      window.open(`/pricing`);
                    } else {
                      window.location.href = window.location.origin + `/pricing`;
                    }
                  }
                });
              }

              clearInterval(this.clipOcrGetIntervalId);

              let fullText;

              if (isMembership) {
                fullText = JSON.parse(clipOcrGetResult.results).full_text_annotation.description.split("\n").join("<br/>");
              } else {
                fullText = JSON.parse(clipOcrGetResult.results).full_text_annotation.description.split("\n").slice(0, 3).join("<br/>");
              }

              this.insertNewParagraph({
                text: fullText,
                focus: true,
              });

              this.closePopup();
            }
          }, 1000);

          sendAmplitudeData(`SLID_1_CLICK_OCR`);
        },
      },
    ];

    if (this.isVdocs && (this.timestamp === 0 || this.timestamp)) {
      settings.splice(0, 0, {
        name: "playIndex",
        icon: `<svg class="play-setting-btn" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 20px; color: rgb(0, 123, 255);">
                
                <title>${this.lang === "ko" ? "이 장면부터 재생" : "Play from here"}</title>    
                <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>`,
        click: () => {
          if (this.seekToTimestamp && this.videoInfo && this.timestamp) {
            this.seekToTimestamp({
              videoKey: this.videoInfo.videoKey,
              timestamp: this.timestamp,
            });

            sendAmplitudeData(`SLID_1_ACTIVATION_CHECK`, {
              type: `imageTune`,
              action: `playIndex`,
              startDate: `20201017`,
            });
          }
        },
      });
    }

    const wrapper = [];

    settings.forEach((tune) => {
      let button = document.createElement("div");

      button.classList.add("cdx-settings-button");
      button.innerHTML = tune.icon;
      button.addEventListener("click", tune.click.bind(this));

      wrapper.push(button);
    });

    return wrapper;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.contentEditable = false;
    this.wrapper.draggable = true;
    this.wrapper.className = `cdx-block img-block-container my-2 p-2`;
    this.wrapper.addEventListener("click", (event) => {
      if (this.seekToTimestamp && this.videoInfo && this.timestamp) {
        this.seekToTimestamp(
          {
            videoKey: this.videoInfo.videoKey,
            timestamp: this.timestamp,
          },
          "click"
        );
      }
    });
    this.wrapper.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Backspace":
          event.stopPropagation();
          event.preventDefault();
          this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
          break;
        case "Enter":
          event.stopPropagation();
          event.preventDefault();
        default:
          return;
      }
    });

    if (this.timestamp) {
      const timestampContainer = document.createElement("span");
      timestampContainer.className = `capture-timestamp-container badge badge-pill badge-light text-muted border`;

      const timestamp = document.createElement("span");
      timestamp.className = `capture-timestamp`;
      timestamp.innerText = `${parseInt(this.timestamp / 60) < 10 ? "0" + parseInt(this.timestamp / 60) : parseInt(this.timestamp / 60)}:${
        this.timestamp % 60 < 10 ? "0" + Math.floor(this.timestamp % 60) : Math.floor(this.timestamp % 60)
      }`;

      timestampContainer.append(timestamp);
      this.wrapper.append(timestampContainer);
    }

    if (this.markupImgSrc) {
      const imgMarkup = document.createElement("img");
      imgMarkup.src = this.markupImgSrc;
      imgMarkup.contentEditable = false;
      imgMarkup.className = `capture-img pointer`;
      imgMarkup.style = `
                width: 100%;
            `;
      imgMarkup.onload = (event) => {
        if (event.target.naturalWidth >= event.target.naturalHeight) {
          event.target.className = event.target.className + " landscape";
        } else {
          event.target.className = event.target.className + " portrait";
        }
      };
      this.wrapper.appendChild(imgMarkup);
    } else {
      const img = document.createElement("img");
      img.contentEditable = false;
      img.className = `capture-img pointer`;
      img.src = this.imgUrl ? this.imgUrl : `/src/assets/loading.gif`;

      if (this.Storage && (this.imgBase64 || (this.imgUrl && this.imgUrl.includes(`;base64`)))) {
        img.onload = this.uploadToStorage;
        img.dataset.uploaded = false;
      } else {
        img.onload = () => {
          if (img.naturalWidth >= img.naturalHeight) {
            img.className = img.className + " landscape";
          } else {
            img.className = img.className + " portrait";
          }
        };
      }
      img.style = `
                width: 100%;
            `;

      this.wrapper.appendChild(img);
    }

    return this.wrapper;
  }

  save(blockContent) {
    if (this.videoInfo && this.videoInfo.captureImgBase64) delete this.videoInfo.captureImgBase64;

    return {
      src: this.imgUrl,
      timestamp: this.timestamp,
      videoInfo: this.videoInfo,
      documentKey: this.documentKey,
      clipKey: this.clipKey,
      deleteIntervalId: this.deleteIntervalId,
      markupImgSrc: this.markupImgSrc,
    };
  }

  static get pasteConfig() {
    return {
      tags: ["IMG"],
      files: {
        mimeTypes: ["image/*"],
        extensions: ["jpg", "png"], // Or you can specify extensions
      },
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i,
      },
    };
  }
  onPaste(event) {
    switch (event.type) {
      case "file":
        switch (event.detail.file.type) {
          case "image/png":
          case "image/jpeg":
            this.uploadImageToStorage({
              file: event.detail.file,
              format: event.detail.file.name.split(".")[event.detail.file.name.split(".").length - 1],
              resultCallBack: async (result) => {
                const imgSrc = env[env["env"]]["end_point_url"]["aws_capture_s3"] + result.key;

                const registeredClip = await ServerInterface_registerClip({
                  accessToken: this.accessToken,
                  data: {
                    img_src: imgSrc,
                    document_key: this.config.documentKey,
                  },
                });

                if (!registeredClip || registeredClip.error_message) {
                  Sentry.withScope((scope) => {
                    scope.setLevel("error");
                    Sentry.captureMessage("SLID_WEB_IMAGE_UPLOAD_ERROR");
                  });
                }

                this.block.holder.querySelector(".capture-img").src = imgSrc;

                this.imgUrl = imgSrc;
                this.clipKey = registeredClip.clip_key;
                this.documentKey = this.config.documentKey;

                this.onEditorUpdate(true);
              },
            });

            return;

          default:
            return this.destroy();
        }

      // when moving image block by drag & drop
      case "tag":
        if (!event.detail.data.currentSrc || !event.detail.data.currentSrc.includes(env[env["env"]]["end_point_url"]["aws_capture_s3"])) return this.destroy();

        const imgSrc = event.detail.data.currentSrc;

        this.config.dragAndDropImageBlock({
          imgSrc: imgSrc,
        });

        this.block.holder.querySelector(".capture-img").src = imgSrc;
        this.imgUrl = imgSrc;
        this.documentKey = this.config.documentKey;
        return;

      default:
        return this.destroy();
    }
  }
}

export default SlidImageBlock;
