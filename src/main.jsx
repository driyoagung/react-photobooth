import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Photobox from "./Photobox.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Photobox />
  </StrictMode>
);
