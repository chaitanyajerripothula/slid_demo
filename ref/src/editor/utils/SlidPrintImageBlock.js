class SlidPrintImageBlock {
  constructor({ data, api, config }) {
    this.api = api;
    this.imgUrl = data.src;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = `img-block-container my-2 p-2`;

    const captureImgContainer = document.createElement("div");
    captureImgContainer.className = `capture-img-container`;

    const img = document.createElement("img");
    img.className = `capture-img`;
    img.src = this.imgUrl;
    img.onload = (event) => {
      const isHorizontalImg = event.target.width > event.target.height;
      if (!isHorizontalImg) {
        img.style.maxHeight = `400pt`;
      }
    };

    captureImgContainer.appendChild(img);

    wrapper.appendChild(captureImgContainer);
    return wrapper;
  }

  save(blockContent) {
    return {
      src: this.imgUrl,
    };
  }
}

export default SlidPrintImageBlock;
