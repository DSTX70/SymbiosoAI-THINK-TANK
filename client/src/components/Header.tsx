import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Brain, Sun, Moon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Dark mode effect
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
            <span className="rounded bg-white/20 px-2 py-1 text-xs font-medium">BETA</span>
          </div>
          <div className="flex items-center space-x-4">
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
            
            {/* Enhanced Header Features */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-toggle-theme" className="text-white hover:bg-white/20">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-help" className="text-white hover:bg-white/20">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2 rounded-lg bg-white/20 px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-white">API Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
