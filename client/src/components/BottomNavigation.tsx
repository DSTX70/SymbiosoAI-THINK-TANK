import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Compass, Brain, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/simple",
    label: "Simple",
    icon: Compass,
  },
  {
    href: "/guided", 
    label: "Guided",
    icon: Brain,
  },
  {
    href: "/expert",
    label: "Expert",
    icon: Settings,
    badge: "PRO",
  },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Only show bottom navigation on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <nav className="flex items-center justify-around py-2 px-4 max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 relative min-w-[60px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`bottom-nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}