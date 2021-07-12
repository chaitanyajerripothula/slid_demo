import React, { useEffect, useState } from "react";
import VideoDocument from "./vdocs/VideoDocument";
import { isMacOs } from "react-device-detect";
import { Provider } from "../store";

const App = () => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(navigator.language || navigator.userLanguage);
  }, []);

  return (
    <Provider>
      <VideoDocument lang={lang} isMacOs={isMacOs} />
    </Provider>
  );
};

export default App;
