import React, { useCallback, useEffect, useState } from "react";
import styles from "./editorController.module.css";
import undoImg from "../../design/assets/slid_backward_icon.png";
import redoImg from "../../design/assets/slid_forward_icon.png";
import settingImg from "../../design/assets/slid_setting_icon.png";
import saveImg from "../../design/assets/slid_double_check_icon.png";
import downloadImg from "../../design/assets/slid_download_icon.png";
import captureImg from "../../design/assets/slid_capture_icon.png";
import areaCaptureImg from "../../design/assets/slid_set_area_icon.png";
import recordingImg from "../../design/assets/slid_recording_gray_icon.png";
import { useReactToPrint } from "react-to-print";
import EditorSetting from "../editorSetting";
import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";

const EditorController = (props) => {
  const {
    componentRef,
    isSaving,
    selectAreaCoordinate,
    captureImgUrl,
    isCapturingOneClick,
    setShowSelectAreaCanvas,
    setCaptureSelectArea,
    setCaptureImgUrl,
    setSelectAreaCoordinate,
    setIsCapturingOneClick,
    editorWidth,
    lang,
    isMacOs,
  } = props;
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState("small");
  const [isOnClickRecordBtn, setIsOnClickRecordBtn] = useState(false);
  const [stream, setStream] = useState("");
  const [recorder, setRecorder] = useState("");
  const [data, setData] = useState("");
  const videos = document.getElementsByTagName("video");
  const video = videos[0];

  useEffect(() => {
    props.handleSetFontSize(fontSize);
  }, [fontSize]);

  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const insertImage = useCallback(() => {
    props.handleInsertImage();
  }, []);

  const openEditorSetting = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const captureOneClick = () => {
    setIsCapturingOneClick(true);
  };

  useEffect(() => {
    if (captureImgUrl !== "" && isCapturingOneClick === false) {
      insertImage();
    }
  }, [isCapturingOneClick]);

  useEffect(() => {
    if (video !== undefined) {
      const stream = video.captureStream();
      const options = {
        mimeType: "video/webm;codecs=vp9,opus",
        videoBitsPerSecond: 2400000,
        //bitsPerSecond: 1000,
      };
      setStream(stream);
      setRecorder(new MediaRecorder(stream, options));
    }
  }, [video]);

  useEffect(() => {
    if (recorder.state === "inactive") {
      setIsOnClickRecordBtn(false);
    }
  }, [recorder.state]);

  useEffect(() => {
    if (data !== "") {
      const recordVideoUrl = URL.createObjectURL(new Blob([data], { type: "video/webm" }));
      props.handleInsertVideo(recordVideoUrl);
    }
  }, [data]);

  const insertVideoLoader = useCallback(() => {
    props.handleInsertVideoLoader();
  });

  const onClickRecordVideoBtn = () => {
    if (video.paused) {
      Swal.fire({
        target: document.getElementById("toast-container"),
        title: "영상을 재생해주세요!",
        html: `<p>영상이 멈춰있는 상태에서는 녹화할 수 없습니다.</p>`,
        position: "center",
        confirmButtonText: "확인",
        icon: "info",
        confirmButtonColor: "#2778c4",
        heightAuto: false,
      }).then(() => {});
    } else {
      if (isOnClickRecordBtn) {
        // stream.getVideoTracks().forEach(function (track) {
        //   track.stop();
        // });
        recorder.stop();
      } else {
        recorder.ondataavailable = (event) => setData(event.data);
        recorder.start();
        insertVideoLoader();
        setIsOnClickRecordBtn(true);
      }
    }
  };

  const onClickAreaSelectBtn = () => {
    setShowSelectAreaCanvas(true);
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "👈 캡쳐할 영역을 선택해주세요.",
      html: "<p style={margin-bottom: 8}>선택한 영역은 계속 유지됩니다.</p>" + "<span style='color:#DDDDDD; font-size: 15'>*영상의 크기를 조절하면 영역이 초기화 됩니다.</span>",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "영역 캡쳐",
      denyButtonText: "초기화",
      heightAuto: false,
    }).then((result) => {
      if (result.isDenied) {
        let videoSize = document.getElementById("video-size-check");
        console.log(videoSize.offsetWidth);
        setSelectAreaCoordinate({
          left: 0,
          top: 0,
          width: videoSize.offsetWidth - 3,
          height: videoSize.offsetHeight - 3,
        });
        setShowSelectAreaCanvas(false);
      } else if (result.isConfirmed) {
        setCaptureSelectArea(true);
        captureOneClick();
        setShowSelectAreaCanvas(false);
      } else {
        setShowSelectAreaCanvas(false);
      }
    });
  };

  return (
    <div className={`${styles[`container`]}`}>
      {open ? <EditorSetting setFontSize={setFontSize} fontSize={fontSize} /> : null}
      {editorWidth > 400 ? null : (
        <div className={`${styles[`video-document-editor-setting-popup`]}`}>
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "영역 지정" : "Set capture area"}</Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickAreaSelectBtn}>
              <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
            </button>
          </OverlayTrigger>
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "클립 녹화" : "Clip recording"} </Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickRecordVideoBtn}>
              {isOnClickRecordBtn ? (
                <img className={`${styles[`video-document-editor-record-active`]}`} src={recordingImg} alt="recordingImg" />
              ) : (
                <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
              )}
              ;
            </button>
          </OverlayTrigger>
        </div>
      )}
      <div className={`${styles[`video-document-editor-left-wrapper`]}`}>
        <div className={`${styles[`video-document-editor-undo-redo-container`]}`}>
          <img
            className={`${styles[`video-document-editor-control-icon`]}`}
            src={undoImg}
            alt="undo"
            onClick={() => {
              props.undoEditor();
            }}
          />
          <img
            className={`${styles[`video-document-editor-control-icon`]}`}
            src={redoImg}
            alt="redo"
            onClick={() => {
              props.redoEditor();
            }}
          />
        </div>
        <div className={`${styles[`video-document-editor-setting-container`]}`} onClick={openEditorSetting}>
          <img className={`${styles[`video-document-editor-setting-icon`]}`} src={settingImg} alt="settingImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>Editor Setting</span>
        </div>
      </div>
      <div className={`${styles[`video-document-editor-center-wrapper`]}`}>
        {editorWidth > 400 ? (
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "영역 지정" : "Set capture area"}</Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickAreaSelectBtn}>
              <img className={`${styles[`video-document-editor-capture-option-icon`]}`} src={areaCaptureImg} alt="areaCaptureImage" />
            </button>
          </OverlayTrigger>
        ) : null}
        <OverlayTrigger
          defaultShow={false}
          placement={"top"}
          overlay={
            <Tooltip>
              {lang === "ko-KR" ? (
                <div>
                  원클릭 캡쳐 <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                </div>
              ) : (
                <div>
                  Screenshot <br />({isMacOs ? "Cmd + /" : "Alt + /"})
                </div>
              )}
            </Tooltip>
          }
        >
          <button
            className={`${styles[`video-document-editor-capture-btn`]} btn btn-primary`}
            onClick={() => {
              captureOneClick();
            }}
          >
            <img className={`${styles[`video-document-editor-capture-icon`]}`} src={captureImg} alt="captureImage" />
          </button>
        </OverlayTrigger>

        {editorWidth > 400 ? (
          <OverlayTrigger defaultShow={false} placement={"top"} overlay={<Tooltip>{lang === "ko-KR" ? "클립 녹화" : "Clip recording"} </Tooltip>}>
            <button className={`${styles[`video-document-editor-capture-option-btn`]} btn btn-light`} onClick={onClickRecordVideoBtn}>
              {isOnClickRecordBtn ? (
                <img className={`${styles[`video-document-editor-record-active`]}`} src={recordingImg} alt="recordingImg" />
              ) : (
                <img className={`${styles[`video-document-editor-recording-icon`]}`} src={recordingImg} alt="recordingImg" />
              )}
            </button>
          </OverlayTrigger>
        ) : null}
      </div>
      <div className={`${styles[`video-document-editor-right-wrapper`]}`}>
        <div className={`${styles[`video-document-editor-save-container`]}`}>
          <img className={`${styles[`video-document-editor-save-icon`]}`} src={saveImg} alt="saveImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>{isSaving ? (lang === "ko-KR" ? "저장 완료" : "Auto Saved") : lang === "ko-KR" ? "자동 저장 중..." : "Saving..."}</span>
        </div>
        <div className={`${styles[`video-document-editor-download-container`]}`} onClick={renderPdfPrint}>
          <img className={`${styles[`video-document-editor-download-icon`]}`} src={downloadImg} alt="downloadImage" />
          <span className={`${styles[`video-document-editor-text`]}`}>Download</span>
        </div>
      </div>
    </div>
  );
};

export default EditorController;
