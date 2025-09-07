import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function devOnly(fn: () => void) {
  if (import.meta.env.DEV) fn();
}

function removeCoveringOverlays() {
  // Remove any placeholder or banner covering the app on Replit/Mobile Safari
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const candidates = Array.from(document.body.children) as HTMLElement[];

  for (const el of candidates) {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const isFullscreenSize = rect.width >= viewportW * 0.98 && rect.height >= viewportH * 0.98;
    const isOnTop = ["fixed", "absolute"].includes(style.position) && (parseInt(style.zIndex || "0", 10) || 0) >= 1;
    const looksLikePlaceholder = /run this app|replit|placeholder/i.test(el.textContent || "");

    if (isFullscreenSize && isOnTop && looksLikePlaceholder) {
      console.warn("[Dev] Removing covering placeholder element:", el);
      el.remove();
    }
  }
}

function ensureZIndexForRoot(rootEl: HTMLElement) {
  const style = window.getComputedStyle(rootEl);
  if (style.position === "static") {
    // Create a stacking context so overlays can't sit above by accident
    rootEl.style.position = "relative";
  }
}

function unregisterServiceWorkersDev() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.getRegistrations?.().then((regs) => {
    for (const reg of regs) {
      console.warn("[Dev] Unregistering SW:", reg.scope);
      reg.unregister();
    }
  }).catch((e) => console.warn("[Dev] SW unregister failed:", e));
}

window.addEventListener("unhandledrejection", (event) => {
  console.warn("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

window.addEventListener("error", (event) => {
  console.warn("Uncaught error:", event.error);
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("❌ #root element not found – check index.html");
} else {
  devOnly(() => {
    unregisterServiceWorkersDev();
    ensureZIndexForRoot(rootEl);
    // Attempt removal twice: once now, once after first paint
    removeCoveringOverlays();
    requestAnimationFrame(removeCoveringOverlays);
  });

  console.log("🎨 Creating React root and rendering App...");
  createRoot(rootEl).render(<App />);
}
