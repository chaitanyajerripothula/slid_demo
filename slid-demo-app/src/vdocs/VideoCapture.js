import React, { useRef } from "react";

const VideoCapture = ({videoPlayerRef}) => {
    const canvasRef = useRef();

    const fullImageCapture = () => {
      let w, h, ratio;

      ratio = videoPlayerRef.current.getInternalPlayer().videoWidth / videoPlayerRef.current.getInternalPlayer().videoHeight;
      console.log(ratio)

      h = 375
      w = parseInt(h * ratio, 10);

      canvasRef.current.width = w;
      canvasRef.current.height = h;

      const ctx = canvasRef.current.getContext('2d');
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h)
      
      //const frame = captureVideoFrame(this.player.getInternalPlayer())
      //let imageURL = frame.dataUri
      let imageURL = canvasRef.current.toDataURL();
    }

    return (
        <div>
            <canvas ref={canvasRef}/>
            <button onClick={fullImageCapture}> Capture </button>
        </div>
    );
};

export default VideoCapture;