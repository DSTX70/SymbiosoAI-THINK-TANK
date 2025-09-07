import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle unhandled promise rejections globally to prevent app crashes
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Prevent the default behavior that would crash the app
  event.preventDefault();
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.warn('Uncaught error:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
