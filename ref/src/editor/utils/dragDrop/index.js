import "./index.css";

/**
 * Drag/Drop feature for Editor.js.
 *
 * @typedef {Object} DragDrop
 * @description Feature's initialization class.
 * @property {Object} api — Editor.js API
 * @property {HTMLElement} holder — DOM element where the editor is initialized.
 * @property {Number} startBlock - Dragged block position.
 * @property {Number} endBlock - Position where the dragged block is gonna be placed.
 * @property {Function} setDragListener - Sets the drag events listener.
 * @property {Function} setDropListener - Sets the drop events listener.
 */
export default class DragDrop {
  /**
   * @param editor: object
   *   editor — Editor.js instance object
   */
  constructor(editor) {
    this.editor = editor;
    this.api = this.editor.blocks;
    this.holder = document.getElementById(this.editor.configuration.holder);

    this.editorContainer = this.holder.closest("#editor-container") || this.holder.closest("#editor-component");

    this.startBlock = null;
    this.endBlock = null;

    this.initPositionY = null;

    this.setMouseDownListener();
    this.setDragListener();
    this.setDropListener();

    this.setOnDragListener();

    this.flag = null;
    this.scrollSpeed = null;
  }

  /**
   * Sets the drag events listener.
   */

  // set throttle function for scroll event
  // Because scroll event occurs a lot of events, set limitation for improving performance
  throttle(fn, delay) {
    let timer;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, arguments);
        }, delay);
      }
    };
  }

  // Add auto scroll on mouse move
  setDragListener() {
    this.holder.addEventListener("mousedown", () => {
      this.startBlock = this.api.getCurrentBlockIndex();
    });
  }

  scrollOnDrag = (e) => {
    let distanceFromOrigin;

    distanceFromOrigin = Math.abs(e.y - this.initPositionY);
    if (e.y > this.initPositionY) {
      this.scrollSpeed = distanceFromOrigin / 10;
    } else if (e.y < this.initPositionY) {
      this.scrollSpeed = -distanceFromOrigin / 10;
    }

    this.editorContainer.scrollTop += this.scrollSpeed;

    // Delete selection on drag
    Array.from(this.holder.querySelectorAll(".ce-block--selected")).forEach((selectedElement) => {
      selectedElement.className = selectedElement.className.replace("ce-block--selected", "");
    });
  };

  setOnDragListener() {
    this.holder.addEventListener("drag", this.throttle(this.scrollOnDrag, 10));
  }

  /**
   * Sets the drop events listener.
   */
  setDropListener() {
    this.holder.addEventListener("drop", (event) => {
      const { target } = event;
      if (this.holder.contains(target)) {
        const dropTarget = this.getDropTarget(target);
        if (dropTarget) {
          this.endBlock = this.getTargetPosition(dropTarget);
          this.moveBlocks();
        }
      }

      var evt = document.createEvent("MouseEvents");
      evt.initEvent("mouseup", true, true);
      document.dispatchEvent(evt);
    });
  }

  /**
   * Sets the drop events listener.
   * set init position of the target
   */
  setMouseDownListener() {
    this.holder.addEventListener("mousedown", (event) => {
      const { target } = event;
      if (this.holder.contains(target)) {
        // set initial mouse position.
        this.initPositionY = event.clientY;
      }
    });
  }

  /**
   * Returns the closest block DOM element to the drop event target.
   *
   * @param {HTMLElement} target  DOM element which received the drop event.
   * @returns {HTMLElement}
   */
  getDropTarget(target) {
    return target.classList.contains("ce-block") ? target : target.closest(".ce-block");
  }

  /**
   * Returns the target position in the child subtree.
   *
   * @param {HTMLElement} target  DOM element which received the drop event.
   * @returns {Number}
   */
  getTargetPosition(target) {
    return Array.from(target.parentNode.children).indexOf(target);
  }

  /**
   * Moves the dragged element to the drop position.
   *
   * @see {@link https://editorjs.io/blocks#move}
   */
  moveBlocks() {
    this.api.move(this.endBlock, this.startBlock);
  }
}
