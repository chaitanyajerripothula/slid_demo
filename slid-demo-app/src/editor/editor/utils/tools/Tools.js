import Header from "./blocks/header/index";
import Paragraph from "./blocks/paragraph/index";
import CheckList from "@editorjs/checklist";
import CodeTool from "./blocks/code/index";
import Marker from "./marker/index";
import NestedList from "./blocks/nestedList/index";
import Underline from "./underline/index";
import SimpleImage from "./blocks/simpleImage/index";
import InlineCode from "./inlineCode/index";

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+H",
    config: {
      placeholder: "Enter a header",
      levels: [4],
      defaultLevel: 4,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      preserveBlank: true,
      convertBlock: ({ blockIndex, blockType, value }) => {
        this.convertBlock({ blockIndex, blockType, value });
      },
      // 자동형식변환기능 -> false(현재 demo 페이지에서 보이지 않는 기능임으로 임시적으로 false 처리)
      checkIsAutoFormatActive: () => {
        return false;
      },
    },
  },
  checkList: {
    class: CheckList,
    inlineToolbar: true,
  },
  codeTool: {
    class: CodeTool,
    shortcut: "CMD+SHIFT+C",
    config: {
      convertBlock: ({ blockIndex, blockType, value }) => {
        this.convertBlock({ blockIndex, blockType, value });
      },
    },
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  nestedList: {
    class: NestedList,
    inlineToolbar: false,
    shortcut: "CMD+SHIFT+L",
  },
  image: {
    class: SimpleImage,
    // config: {
    //   timestamp: 11,
    // },
  },
  underline: {
    class: Underline,
    shortcut: "CMD+SHIFT+U",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+E",
  },
};
