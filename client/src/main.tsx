import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx loaded");
const rootElement = document.getElementById("root");
console.log("root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("creating root");
  root.render(<App />);
  console.log("app rendered");
} else {
  console.error("Root element not found");
}
