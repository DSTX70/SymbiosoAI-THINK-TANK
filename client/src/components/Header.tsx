import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon, HelpCircle, Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthButton } from "@/components/AuthButton";
import { useIsMobile } from "@/hooks/use-mobile";
// import logoImage from "../assets/symbiosoai-logo.png";
const logoImage = "/symbiosoai-logo.png";

export default function Header() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const isExpertMode = location.startsWith("/expert");

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
      <div className="max-w-7xl mx-auto px-6 py-1">
        {/* Logo Row with Navigation and Sessions + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img 
                src={logoImage} 
                alt="SymbiosoAi - Collaborative Intelligence, redefined"
                className="h-32 w-auto max-w-lg"
                data-testid="logo-symbiosoai"
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
              <div className="text-white text-xl font-bold" style={{display: 'none'}}>
                SymbiosoAi
              </div>
            </Link>
            
            {/* Navigation positioned with logo - Hidden on mobile */}
            {!isMobile && (
              <nav className="flex gap-2 items-center">
                <Link 
                  href="/" 
                  className={`mode-pill ${location === "/" ? "active" : ""}`}
                  data-testid="link-home"
                >
                  Home
                </Link>
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
                  href="/expert" 
                  className={`mode-pill ${location === "/expert" ? "active" : ""}`}
                  data-testid="link-expert-mode"
                >
                  Expert
                </Link>
                <Link 
                  href="/trust-center" 
                  className={`mode-pill ${location === "/trust-center" ? "active" : ""}`}
                  data-testid="link-trust-center"
                >
                  Trust
                </Link>
              </nav>
            )}
          </div>
          
          {/* Right side: Sessions + Dropdown */}
          <div className="flex items-center gap-2">
            <Link 
              href="/sessions" 
              className={`mode-pill ${location.startsWith("/sessions") ? "active" : ""}`}
              data-testid="link-sessions"
            >
              Sessions
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="rounded bg-white/20 px-2 py-1 text-xs font-medium">BETA</span>
              <AuthButton />
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
            
            {/* Mobile Auth Buttons - Visible on mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <AuthButton />
            </div>
            
            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <DropdownMenuItem onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-sm">API Connected</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Theme</span>
                      <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Help</span>
                      <HelpCircle className="h-4 w-4" />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span className="rounded bg-primary/20 px-2 py-1 text-xs font-medium">BETA</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <AuthButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
