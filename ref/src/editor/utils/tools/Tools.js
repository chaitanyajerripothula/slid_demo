import Paragraph from "../blocks/paragraph/index";
import List from "../blocks/list/index";
import NestedList from "../blocks/nestedList";
import Checklist from "@editorjs/checklist";
import Header from "../blocks/header/index";
import Loader from "../blocks/loader/index";
import Image from "../blocks/image/index";
import VideoLoader from "../blocks/videoLoader/index";
import Underline from "../tools/underline/index";
import Marker from "../tools/marker/index";
import InlineCode from "../tools/inlineCode/index";
import Video from "../blocks/video/index";
import LaTeXTool from "../blocks/latex";
import CodeTool from "../blocks/code";

const Tools = {
  list: {
    class: List,
  },
  nestedList: {
    class: NestedList,
  },
  paragraph: {
    class: Paragraph,
  },
  header: {
    class: Header,
  },
  underline: {
    class: Underline,
    shortcut: "CMD+U",
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+H",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+E",
  },
  checklist: {
    class: Checklist,
  },
  loader: {
    class: Loader,
  },
  image: {
    class: Image,
  },
  video: {
    class: Video,
  },
  videoLoader: {
    class: VideoLoader,
  },
  Math: {
    class: LaTeXTool,
  },
  codeTool: {
    class: CodeTool,
  },
};

export default Tools;
