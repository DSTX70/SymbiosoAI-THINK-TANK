import { Link, useLocation } from "wouter";
import logoHorizontal from "@assets/symbiosoai-logo-horizontal.png";
import logoLight from "@assets/symbiosoai-logo-light.png";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 header-gradient text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={logoHorizontal} 
              alt="SymbiosoAi" 
              className="h-8 object-contain"
              data-testid="logo-symbiosoai"
            />
            <div>
              <h1 className="text-h3 font-heading font-bold tracking-tight">ThinkTank</h1>
              <p className="text-caption opacity-80">Intelligent Collaboration, redefined.</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Link 
              href="/simple" 
              className={`mode-pill ${location === "/simple" ? "active" : ""}`}
              data-testid="link-simple-mode"
            >
              Simple
            </Link>
            <Link 
              href="/guided" 
              className={`mode-pill ${location === "/guided" ? "active" : ""}`}
              data-testid="link-guided-mode"
            >
              Guided
            </Link>
            <Link 
              href="/sessions" 
              className={`mode-pill ${location.startsWith("/sessions") ? "active" : ""}`}
              data-testid="link-sessions"
            >
              Sessions
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
