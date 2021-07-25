import React from "react";
import reactCSS from "reactcss";
import { CirclePicker, SketchPicker } from "react-color";
import Swal from "sweetalert2";
import { renderToStaticMarkup } from "react-dom/server";
import SweetAlert from "react-bootstrap-sweetalert";

class CircleExample extends React.Component {
  state = {
    color: {
      r: this.props.color.r,
      g: this.props.color.g,
      b: this.props.color.b,
      a: this.props.color.a,
    },
  };

  // showColorPickerPopup = () => {
  //   Swal.fire({
  //     title: "popup",
  //   });
  // };
  handleClick = () => {
    console.log("handleClick");
    this.props.setDisplayColorPicker(!this.props.displayColorPicker);
    // <SweetAlert title={"색상을 선택하세요"}>
    //   <CirclePicker color={this.state.color} colors={["rgba(255, 19, 0, 1)", "rgba(236, 120, 120, 1)", "rgba(156, 39, 176, 1)"]} onChange={this.handleChange} />
    // </SweetAlert>;
    // Swal.fire({
    //   target: document.getElementById("toast-container"),
    //   title: "Title",
    //   text: "hi",
    //   html: '<CirclePicker color={${this.state.color}} colors={["rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 0.3)"]} onChange={${this.handleChange}} />',
    //   position: "center",
    //   heightAuto: false,
    // }).then(() => {});
    // this.showColorPickerPopup();
  };

  handleClose = () => {
    this.props.setDisplayColorPicker(false);
  };

  handleChange = (color) => {
    console.log(color);
    this.props.setColor(color.rgb);
    this.setState({ color: color.rgb });
    this.handleClose();
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b}, ${this.props.color.a})`,
        },
        // swatch: {
        //   padding: "5px",
        //   background: "#fff",
        //   borderRadius: "50%",
        //   boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        //   display: "inline-block",
        //   cursor: "pointer",
        // },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    const colorArray = [
      {
        r: 255,
        g: 19,
        b: 0,
        a: 1,
      },
    ];

    return (
      <div>
        <div onClick={this.handleClick}>
          <button type="button" className={`btn btn-light`}>
            <div style={styles.color} />
          </button>
        </div>
        {this.props.displayColorPicker ? (
          <SweetAlert title={"색상을 선택하세요"} onConfirm={this.onConfirm} showConfirm={false}>
            {this.props.highlightColorPicker ? (
              <CirclePicker color={this.state.color} colors={[`rgba(255, 19, 0, 0.3)`, "rgba(236, 120, 120, 0.3)", "rgba(156, 39, 176, 0.3)"]} onChange={this.handleChange} />
            ) : (
              <CirclePicker color={this.state.color} colors={[`rgba(255, 19, 0, 1)`, "rgba(236, 120, 120, 1)", "rgba(156, 39, 176, 1)"]} onChange={this.handleChange} />
            )}
          </SweetAlert>
        ) : null}
      </div>
    );
  }
}

export default CircleExample;
