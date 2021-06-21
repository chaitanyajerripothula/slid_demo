import React, { useEffect, useState } from "react";
import VideoDocument from "../src/vdocs/VideoDocument";

const Main = () => {
  
  const [ lang, setLang ] = useState("en");
  //window browser 이용
  useEffect(()=>{
    // language 설정
    setLang();
  }, []);
  return <VideoDocument lang={lang} />;
};

export default Main;
