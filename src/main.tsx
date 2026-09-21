import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW roʻyxatdan oʻtdi:', reg.scope))
      .catch((err) => console.error('SW xatosi:', err));
  });
}
createRoot(document.getElementById("root")!).render(<App />);
