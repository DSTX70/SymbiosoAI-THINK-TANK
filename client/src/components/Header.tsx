import { Link, useLocation } from "wouter";
import { Brain } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 header-gradient text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="brand-mark">
              <Brain className="text-white text-xs" size={12} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono tracking-tight">SymbiosoAi ThinkTank</h1>
              <p className="text-sm opacity-80">Collaborative Intelligence, redefined.</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Link 
              href="/simple" 
              className={`mode-pill ${location === "/simple" ? "active" : ""}`}
              data-testid="link-simple-mode"
            >
              ⚡ Simple
            </Link>
            <Link 
              href="/guided" 
              className={`mode-pill ${location === "/guided" ? "active" : ""}`}
              data-testid="link-guided-mode"
            >
              ⚙️ Guided
            </Link>
            <Link 
              href="/expert" 
              className={`mode-pill ${location === "/expert" ? "active" : ""}`}
              data-testid="link-expert-mode"
            >
              🧠 Expert
            </Link>
            <Link 
              href="/sessions" 
              className={`mode-pill ${location.startsWith("/sessions") ? "active" : ""}`}
              data-testid="link-sessions"
            >
              📋 Sessions
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
