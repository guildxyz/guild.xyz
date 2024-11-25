"use client";

import ReactDOM from "react-dom";

export const PreloadResources = () => {
  ReactDOM.preload(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-opsz-normal.woff2",
    {
      as: "font",
      crossOrigin: "",
      type: "font/woff2",
    },
  );
  ReactDOM.preload(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-opsz-italic.woff2",
    {
      as: "font",
      crossOrigin: "",
      type: "font/woff2",
    },
  );
  return null;
};
