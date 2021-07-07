import env from "../../../env.json";
import { saveAs } from "file-saver";
import {
  Document as Docx_Document,
  Packer as Docx_Packer,
  Paragraph as Docx_Paragraph,
  // TextRun as Docx_TextRun,
  Media as Docx_Media,
  HeadingLevel as Docx_HeadingLevel,
  // HyperlinkRef,
  HyperlinkType,
} from "docx";

import json2md from "json2md";
import TurndownService from "turndown";

import JSZip from "jszip";

const trundownService = new TurndownService();

export const exportToWord = async ({ currentContent, title, documentKey, callBack }) => {
  // Create document
  const doc = new Docx_Document({
    hyperlinks: {
      docsLink: {
        link: `${env[env["env"]]["end_point_url"]["slid_web"]}/docs/${documentKey}`,
        text: "Click to open Slid docs",
        type: HyperlinkType.EXTERNAL,
      },
    },
  });

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.src = url;
    });

  const docxBlocks = [];

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
            heading: Docx_HeadingLevel[`HEADING_${block.data.level - 1}`],
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

      case "blockList":
        block.data.items.forEach((item, index) => {
          docxBlocks.push(
            new Docx_Paragraph({
              text: strip(item),
              bullet: {
                level: block.data.indentLevel,
              },
            })
          );
        });

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
    callBack();
  });
};

// add custom markdown
json2md.converters.checkBox = (items) => {
  const checkBoxes = [];
  items.forEach((item) => {
    checkBoxes.push(`- [${item.checked ? "x" : " "}] ${trundownService.turndown(item.text)}`);
  });
  return checkBoxes.join("\n");
};

json2md.converters.iframe = (item) => {
  return `<iframe src="${item.src}"></iframe>`;
};

json2md.converters.video = (item) => {
  return `[![${item.title}](${item.posterUrl})](${item.link})`;
};

json2md.converters.notionVideo = (item) => {
  // Notion automatically converts the iframe into video tag.
  return `<iframe src="${item.videoUrl}"/></iframe>`;
};

json2md.converters.latex = (item) => {
  return `![${item.latexContent}](${item.latexImgUrl})`;
};

json2md.converters.timestampImg = (item) => {
  return `[![${item.title}](${item.source})](${item.vdocsUrl})`;
};

json2md.converters.nestedUl = (items) => {
  const ulBlocks = [];
  let level = 0;
  const indent = "  ";
  const addListContentToMarkdownJsonObjects = (items, level) => {
    items.forEach((item, index) => {
      ulBlocks.push(indent.repeat(level) + "- " + trundownService.turndown(item.content));

      addListContentToMarkdownJsonObjects(item.items, level + 1);
    });
  };
  addListContentToMarkdownJsonObjects(items, level);

  return ulBlocks.join("\n");
};

json2md.converters.nestedOl = (items) => {
  const olBlocks = [];
  let level = 0;
  const indent = "   ";
  const addListContentToMarkdownJsonObjects = (items, level) => {
    items.forEach((item, index) => {
      olBlocks.push(indent.repeat(level) + `${index + 1}. ` + trundownService.turndown(item.content));

      addListContentToMarkdownJsonObjects(item.items, level + 1);
    });
  };
  addListContentToMarkdownJsonObjects(items, level);

  return olBlocks.join("\n");
};

json2md.converters.blockList = ({ items, indentLevel }) => {
  const ulBlocks = [];
  const indent = "  ";
  const addListContentToMarkdownJsonObjects = (items) => {
    items.forEach((item, index) => {
      ulBlocks.push(indent.repeat(indentLevel) + "- " + trundownService.turndown(item));
    });
  };
  addListContentToMarkdownJsonObjects(items);

  return ulBlocks.join("\n");
};

export const exportToMarkdown = async ({ currentContent, title, documentKey, callBack }) => {
  const markdownJsonObjects = [
    {
      link: {
        title: `→ Open in Slid`,
        source: `${env[env["env"]]["end_point_url"]["slid_web"]}/docs/${documentKey}`,
      },
    },
    // {
    //     iframe: {
    //         src: `${env[env["env"]]["end_point_url"]["slid_web"]}/vdocs/${documentKey}`,
    //     }
    // },
    {
      p: `---`,
    },
  ];

  currentContent.blocks.forEach((block) => {
    switch (block.type) {
      case "image":
        const downloadImgSrc = block.data.markupImgSrc ? block.data.markupImgSrc : block.data.src;

        const timestampImg = {
          title: `${title ? title : "Untitled"} image`,
          source: downloadImgSrc,
        };

        if (block.data.videoInfo) {
          timestampImg.vdocsUrl = `${env[env["env"]]["end_point_url"]["slid_web"]}/vdocs/${documentKey}?v=${block.data.videoInfo.videoKey}&start=${block.data.timestamp ? block.data.timestamp : 0}`;
        }

        markdownJsonObjects.push({
          timestampImg: timestampImg,
        });
        return;

      case "paragraph":
        markdownJsonObjects.push({
          p: trundownService.turndown(block.data.text),
        });
        return;

      case "header":
        const headerObject = {};
        headerObject[`h${block.data.level - 1}`] = trundownService.turndown(block.data.text);
        markdownJsonObjects.push(headerObject);
        return;

      case "list":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            ul: block.data.items.map((item) => trundownService.turndown(item)),
          });
        } else {
          markdownJsonObjects.push({
            ol: block.data.items.map((item) => trundownService.turndown(item)),
          });
        }
        return;

      case "nestedList":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            nestedUl: block.data.items,
          });
        } else {
          markdownJsonObjects.push({
            nestedOl: block.data.items,
          });
        }

        return;

      case "blockList":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            blockList: { items: block.data.items, indentLevel: block.data.indentLevel },
          });
        } else {
          markdownJsonObjects.push({
            blockList: { items: block.data.items, indentLevel: block.data.indentLevel },
          });
        }

        return;

      case "checklist":
        markdownJsonObjects.push({
          checkBox: block.data.items,
        });
        return;

      case "video":
        markdownJsonObjects.push({
          video: {
            title: `${title} clip thumbnail`,
            posterUrl: block.data.posterUrl,
            link: `${env[env["env"]]["end_point_url"]["slid_web"]}/docs/${documentKey}`,
            videoUrl: block.data.videoUrl,
          },
        });
        return;

      case "Math":
        markdownJsonObjects.push({
          latex: {
            latexContent: `${block.data.math}`,
            latexImgUrl: encodeURI(`https://latex.codecogs.com/svg.latex?\\dpi{300}${block.data.math}`),
          },
        });
        return;

      case "codeTool":
        markdownJsonObjects.push({
          code: {
            content: block.data.code.split("\n"),
          },
        });
        return;

      default:
        return;
    }
  });
  var blob = new Blob([json2md(markdownJsonObjects)], {
    type: "text/markdown;charset=utf-8",
  });
  saveAs(blob, title ? `${title}.md` : "Untitled.md");
};

export const exportToNotion = async ({ currentContent, title, documentKey, callBack }) => {
  const markdownJsonObjects = [
    {
      link: {
        title: `→ Open in Slid`,
        source: `${env[env["env"]]["end_point_url"]["slid_web"]}/docs/${documentKey}`,
      },
    },
    // {
    //     iframe: {
    //         src: `${env[env["env"]]["end_point_url"]["slid_web"]}/vdocs/${documentKey}`,
    //     }
    // },
    {
      p: `---`,
    },
  ];

  currentContent.blocks.forEach((block) => {
    switch (block.type) {
      case "image":
        const downloadImgSrc = block.data.markupImgSrc ? block.data.markupImgSrc : block.data.src;

        const timestampImg = {
          title: `${title ? title : "Untitled"} image`,
          source: downloadImgSrc,
        };

        if (block.data.videoInfo) {
          timestampImg.vdocsUrl = `${env[env["env"]]["end_point_url"]["slid_web"]}/vdocs/${documentKey}?v=${block.data.videoInfo.videoKey}&start=${block.data.timestamp ? block.data.timestamp : 0}`;
        }

        markdownJsonObjects.push({
          timestampImg: timestampImg,
        });
        return;

      case "paragraph":
        markdownJsonObjects.push({
          p: trundownService.turndown(block.data.text),
        });
        return;

      case "header":
        const headerObject = {};
        headerObject[`h${block.data.level - 1}`] = trundownService.turndown(block.data.text);
        markdownJsonObjects.push(headerObject);
        return;

      case "list":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            ul: block.data.items.map((item) => trundownService.turndown(item)),
          });
        } else {
          markdownJsonObjects.push({
            ol: block.data.items.map((item) => trundownService.turndown(item)),
          });
        }
        return;

      case "nestedList":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            nestedUl: block.data.items,
          });
        } else {
          markdownJsonObjects.push({
            nestedOl: block.data.items,
          });
        }

        return;

      case "blockList":
        if (block.data.style === "unordered") {
          markdownJsonObjects.push({
            blockList: { items: block.data.items, indentLevel: block.data.indentLevel },
          });
        } else {
          markdownJsonObjects.push({
            blockList: { items: block.data.items, indentLevel: block.data.indentLevel },
          });
        }

        return;

      case "checklist":
        markdownJsonObjects.push({
          checkBox: block.data.items,
        });
        return;

      case "video":
        markdownJsonObjects.push({
          notionVideo: {
            title: `${title} clip thumbnail`,
            posterUrl: block.data.posterUrl,
            link: `${env[env["env"]]["end_point_url"]["slid_web"]}/docs/${documentKey}`,
            videoUrl: block.data.videoUrl,
          },
        });
        return;

      case "Math":
        markdownJsonObjects.push({
          latex: {
            latexContent: `${block.data.math}`,
            latexImgUrl: encodeURI(`https://latex.codecogs.com/svg.latex?\\dpi{300}${block.data.math}`),
          },
        });
        return;

      case "codeTool":
        markdownJsonObjects.push({
          code: {
            content: block.data.code.split("\n"),
          },
        });
        return;

      default:
        return;
    }
  });
  var blob = new Blob([json2md(markdownJsonObjects)], {
    type: "text/markdown;charset=utf-8",
  });
  saveAs(blob, title ? `${title}.md` : "Untitled.md");
};

export const exportToImage = async ({ currentContent, title, callBack }) => {
  const imageBlocks = currentContent.blocks.filter((block) => {
    return block.type === "image";
  });

  let zip = new JSZip();
  let folder = zip.folder(title);

  for (let i = 0; i < imageBlocks.length; i++) {
    const imageBlob = await fetch(imageBlocks[i].data.markupImgSrc ? imageBlocks[i].data.markupImgSrc + `?rand=${Date.now()}` : imageBlocks[i].data.src + `?rand=${Date.now()}`).then((response) =>
      response.blob()
    );
    const imageFile = new File([imageBlob], "filename.jpg");
    folder.file(`${title}_${i}.png`, imageFile);
  }

  zip
    .generateAsync({ type: "blob" })
    .then((content) => {
      saveAs(content, `${title}.zip`);
      callBack();
    })
    .catch(() => {
      callBack();
    });
};
