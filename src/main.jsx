import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdvisorToolbox from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdvisorToolbox />
  </StrictMode>
);
