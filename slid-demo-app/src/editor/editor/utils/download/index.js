import { saveAs } from "file-saver";
//import { Document, Packer, Paragraph, TextRun } from "docx";
import { Document as Docx_Document, Packer as Docx_Packer, Paragraph as Docx_Paragraph, Media as Docx_Media, HeadingLevel as Docx_HeadingLevel, HyperlinkType } from "docx";
import * as fs from "fs";
import json2md from "json2md";
import TurndownService from "turndown";

import JSZip from "jszip";

const turnDownService = new TurndownService();

/* docx */
export const exportToWord = async ({ currentContent, title }) => {
  console.log(`currentContent : ${currentContent}`);
  const docxBlocks = [];

  //   const doc = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [
  //           new Paragraph({
  //             children: [
  //               new TextRun("Hello World"),
  //               new TextRun({
  //                 text: "Foo Bar",
  //                 bold: true,
  //               }),
  //               new TextRun({
  //                 text: "\tGithub is the best",
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //         ],
  //       },
  //     ],
  //   });

  const doc = new Document({});

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.src = url;
    });

  for (let i = 0; i < currentContent.blocks.length; i++) {
    const block = currentContent.blocks[i];

    function strip(html) {
      html = html.replaceAll("<br>", "\n");
      html = html.replaceAll("<br/>", "\n");
      let doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }

    switch (block.type) {
      case "image":
        const downloadImgSrc = block.data.markupImgSrc ? block.data.markupImgSrc : block.data.src;

        const loadedImage = await loadImage(downloadImgSrc);

        const blob = await fetch(downloadImgSrc + `?rand=${Date.now()}`).then((r) => r.blob());

        // full width 600
        // full height 930
        let adjustedWidth;
        let adjustedHeight;

        if (loadedImage.naturalWidth > loadedImage.naturalHeight) {
          adjustedWidth = 600;
          adjustedHeight = (600 * loadedImage.naturalHeight) / loadedImage.naturalWidth;
        } else {
          adjustedWidth = (337.5 * loadedImage.naturalWidth) / loadedImage.naturalHeight;
          adjustedHeight = 337.5;
        }

        docxBlocks.push(new Docx_Paragraph(Docx_Media.addImage(doc, blob, adjustedWidth, adjustedHeight)));

        break;

      case "paragraph":
        docxBlocks.push(
          new Docx_Paragraph({
            text: strip(block.data.text),
            spacing: {
              after: 200,
            },
            break: true,
          })
        );
        break;

      case "header":
        docxBlocks.push(
          new Docx_Paragraph({
            text: strip(block.data.text),
            heading: Docx_HeadingLevel[`HEADING_${block.data.level - 2}`],
            spacing: {
              after: 100,
            },
            break: true,
          })
        );
        break;

      case "list":
        block.data.items.forEach((item, index) => {
          docxBlocks.push(
            new Docx_Paragraph({
              text: strip(item),
              bullet: {
                level: 0,
              },
            })
          );
        });
        break;

      case "nestedList":
        let level = 0;

        const addListContentToParagraph = (items, level) => {
          items.forEach((item, index) => {
            docxBlocks.push(
              new Docx_Paragraph({
                text: strip(item.content),
                bullet: {
                  level: level,
                },
              })
            );

            addListContentToParagraph(item.items, level + 1);
          });
        };

        addListContentToParagraph(block.data.items, level);

        break;

      case "checklist":
        block.data.items.forEach((item, index) => {
          docxBlocks.push(
            new Docx_Paragraph({
              text: strip(item.text),
              bullet: {
                level: 0,
              },
            })
          );
        });
        break;

      case "Math":
        const latexImgSrc = encodeURI(`https://latex.codecogs.com/png.latex?\\dpi{300}${strip(block.data.math)}`);

        const loadedLatexImage = await loadImage(latexImgSrc);

        const latexBlob = await fetch(latexImgSrc).then((r) => r.blob());

        // full width 600
        // full height 930
        let adjustedWidthForLatex;
        let adjustedHeightForLatex;

        if (loadedLatexImage.naturalWidth > loadedLatexImage.naturalHeight) {
          adjustedWidthForLatex = 200;
          adjustedHeightForLatex = (200 * loadedLatexImage.naturalHeight) / loadedLatexImage.naturalWidth;
        } else {
          adjustedWidthForLatex = (100 * loadedLatexImage.naturalWidth) / loadedLatexImage.naturalHeight;
          adjustedHeightForLatex = 100;
        }

        docxBlocks.push(new Docx_Paragraph(Docx_Media.addImage(doc, latexBlob, adjustedWidthForLatex, adjustedHeightForLatex)));
        break;

      case "video":
        const downloadPosterSrc = block.data.posterUrl;

        const loadedPosterImage = await loadImage(downloadPosterSrc);

        const blobForPoster = await fetch(downloadPosterSrc + `?rand=${Date.now()}`).then((r) => r.blob());

        // full width 600
        // full height 930
        let adjustedWidthForPoster;
        let adjustedHeightForPoster;

        if (loadedPosterImage.naturalWidth > loadedPosterImage.naturalHeight) {
          adjustedWidthForPoster = 600;
          adjustedHeightForPoster = (600 * loadedPosterImage.naturalHeight) / loadedPosterImage.naturalWidth;
        } else {
          adjustedWidthForPoster = (337.5 * loadedPosterImage.naturalWidth) / loadedPosterImage.naturalHeight;
          adjustedHeightForPoster = 337.5;
        }

        const videoPosterImage = Docx_Media.addImage(doc, blobForPoster, adjustedWidthForPoster, adjustedHeightForPoster);
        docxBlocks.push(
          new Docx_Paragraph({
            // children: [new HyperlinkRef("docsLink"), videoPosterImage],
            children: [videoPosterImage],
          })
        );

        break;

      case "codeTool":
        docxBlocks.push(
          new Docx_Paragraph({
            text: strip(block.data.code),
            spacing: {
              after: 200,
            },
            break: true,
          })
        );
        break;

      default:
        break;
    }
  }

  doc.addSection({
    properties: {},
    children: docxBlocks,
  });

  Docx_Packer.toBlob(doc).then((blob) => {
    saveAs(blob, title ? `${title}.docx` : `Untitled.docx`);
  });
};
