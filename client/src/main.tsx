import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add debugging to track app mounting
console.log("🚀 SymbiosoAi: main.tsx loading...");

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

const rootElement = document.getElementById("root");
console.log("🎯 Root element found:", rootElement);

if (rootElement) {
  console.log("🎨 Creating React root and rendering App...");
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("✅ SymbiosoAi App rendered successfully!");
} else {
  console.error("❌ Could not find root element!");
  // Create a fallback if root element is missing
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>SymbiosoAi Debug Mode</h1>
      <p>Root element not found - creating fallback interface</p>
      <button onclick="location.reload()">Reload App</button>
    </div>
  `;
}
