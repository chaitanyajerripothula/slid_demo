import React, { useEffect, useState } from "react";
import VideoDocument from "./vdocs/VideoDocument";
import { isMacOs } from "react-device-detect";
import { StoreProvider } from "./store";

const App = () => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(navigator.language || navigator.userLanguage);
  }, []);

  return (
    <StoreProvider>
      <VideoDocument lang={lang} isMacOs={isMacOs} />
    </StoreProvider>
  );
};

export default App;
