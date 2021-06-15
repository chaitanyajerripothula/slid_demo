import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import CheckList from "@editorjs/checklist";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/list";
import SimpleImage from "./blocks/simpleImage/index";

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+H",
  },
  paragraph: { class: Paragraph, inlineToolbar: true },
  checkList: {
    class: CheckList,
    inlineToolbar: true,
  },
  code: {
    class: CodeTool,
    shortcut: "CMD+SHIFT+C",
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  list: {
    class: NestedList,
    inlineToolbar: false,
    shortcut: "CMD+SHIFT+L",
  },
  image: {
    class: SimpleImage,
  },
};
