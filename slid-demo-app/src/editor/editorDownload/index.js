import React from "react";
import styles from "./editorDownload.module.css";
import pdfFileImg from "../../design/assets/slid_download_pdf_icon.png";
import wordFileImg from "../../design/assets/slid_download_word_icon.png";
import pngFileImg from "../../design/assets/slid_download_png_icon.png";
import markdownFileImg from "../../design/assets/slid_download_markdown_icon.png";
import { useReactToPrint } from "react-to-print";
import { exportToWord } from "../editor/utils/download";

const EditorDownload = (props) => {
  const { componentRef, currentContent } = props;

  console.log(`this editor : ${props.currentContent.blocks.getBlocksCount()}`);
  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={`${styles[`editor-download-container`]}`}>
      <span className={`${styles[`editor-download-container-title`]}`}>다운로드 설정</span>
      <a className={`${styles[`editor-download-container-item`]}`} href="#" onClick={renderPdfPrint}>
        <img src={pdfFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        PDF
      </a>
      <a
        className={`${styles[`editor-download-container-item`]}`}
        href="#"
        onClick={() => {
          exportToWord({ currentContent: currentContent, title: "testTitle" });
        }}
      >
        <img src={wordFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Word
      </a>
      <a className={`${styles[`editor-download-container-item`]}`} href="#">
        <img src={pngFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Images
      </a>
      <a className={`${styles[`editor-download-container-item`]}`} href="#">
        <img src={markdownFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Markdown
      </a>
    </div>
  );
};

export default EditorDownload;
