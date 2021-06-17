import React, { useRef } from "react";

const VideoCapture = ({videoPlayerRef}) => {
    const canvasRef = useRef();

    const fullImageCapture = () => {
      let w, h, ratio;

      ratio = videoPlayerRef.current.videoWidth / videoPlayerRef.current.videoHeight;
      //console.log(ratio.toString)

      h = 375
      w = 600
      //w = parseInt(h * ratio, 10);

      canvasRef.current.width = w;
      canvasRef.current.height = h;

      const ctx = canvasRef.current.getContext('2d');
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(videoPlayerRef.current.getInternalPlayer(), 0, 0, w, h)
      
      //const frame = captureVideoFrame(this.player.getInternalPlayer())
      //let imageURL = frame.dataUri
      let imageURL = ctx.toDataURL();
      console.log(imageURL);
    }

    return (
        <div>
            <canvas ref={canvasRef}/>
            <button onClick={fullImageCapture}> Capture </button>
        </div>
    );
};

export default VideoCapture;