import React, { useEffect, useState } from "react";
import VideoDocument from "./vdocs/VideoDocument";
import {isMacOs} from 'react-device-detect';

const App = () => {
  const [ lang, setLang ] = useState("en");
  
  useEffect(async ()=>{
    // language 설정
    // window browser 이용
    setLang(navigator.language || navigator.userLanguage);
  }, []);

  useEffect(()=>{
    console.log(lang);
  }, [lang]);

  return <VideoDocument lang={lang} isMacOs={isMacOs} />;
};

export default App;
