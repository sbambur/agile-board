import React from "react";
import { render } from "react-dom";

import App from "./App";
import { StoreContextProvider } from "./context";

import CssBaseline from "@mui/material/CssBaseline";

render(
  <React.StrictMode>
    <StoreContextProvider>
      <CssBaseline />
      <App />
    </StoreContextProvider>
  </React.StrictMode>,

  document.querySelector("#root")
);
