import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StateProvider from "@/providers/StateProvider";
import NakamaProvider from "@/providers/NakamaProvider";

createRoot(document.getElementById("root")).render(
  <StateProvider>
    <NakamaProvider>
      <App />
    </NakamaProvider>
  </StateProvider>
);
