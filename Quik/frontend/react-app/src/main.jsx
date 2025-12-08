import { pdfjs } from "react-pdf";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
