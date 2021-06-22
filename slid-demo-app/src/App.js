import React, { useEffect, useState } from "react";
import VideoDocument from "./vdocs/VideoDocument";

const Main = () => {
  
  const [ lang, setLang ] = useState("en");
  useEffect(()=>{
    // language 설정
    //window browser 이용
    setLang();
  }, []);
  return <VideoDocument lang={lang} />;
};

export default Main;
