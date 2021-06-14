import "./index.css";

class Loader {
  constructor({ data, config, api, readOnly = false }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data;
  }

  render() {
    const loader = document.createElement("div");
    loader.className = "cdx-loader";
    return loader;
  }

  save() {
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default Loader;
