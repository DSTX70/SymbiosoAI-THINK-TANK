import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Compass, Brain, Settings, FileText, Users, Zap, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationSections: NavSection[] = [
  {
    title: "Analysis Modes",
    items: [
      {
        href: "/",
        label: "Home",
        icon: Home,
        description: "Getting started",
      },
      {
        href: "/simple",
        label: "Simple Mode",
        icon: Compass,
        description: "Quick AI insights",
      },
      {
        href: "/guided", 
        label: "Guided Mode",
        icon: Brain,
        description: "Structured analysis",
      },
      {
        href: "/expert",
        label: "Expert Mode",
        icon: Settings,
        badge: "PRO",
        description: "Advanced features",
      },
    ],
  },
  {
    title: "Expert Features",
    items: [
      {
        href: "/expert?tab=analysis",
        label: "Expert Analysis",
        icon: Brain,
        description: "AI debate configuration",
      },
      {
        href: "/templates",
        label: "Template Library",
        icon: FileText,
        description: "Pre-built analysis templates",
      },
      {
        href: "/expert?tab=workspace",
        label: "Workspace",
        icon: Users,
        description: "Team collaboration",
      },
    ],
  },
  {
    title: "Enterprise Automation",
    items: [
      {
        href: "/automation",
        label: "Automation Suite",
        icon: Workflow,
        badge: "NEW",
        description: "Time tracking, invoicing & workflows",
      },
    ],
  },
];

interface DesktopSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function DesktopSidebar({ isOpen = true, onToggle }: DesktopSidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Only show desktop sidebar on desktop screens when in expert mode
  const isExpertMode = location.startsWith("/expert");
  if (isMobile || !isExpertMode) {
    return null;
  }

  return (
    <aside className={cn(
      "fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 bg-background border-r border-border",
      isOpen ? "w-64" : "w-16",
      "overflow-y-auto"
    )}>
      <div className="p-3 space-y-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-3">
            {isOpen && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <nav className="space-y-3">
              {section.items.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href.split("?")[0]));
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div 
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      )}
                      data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Icon className={cn("h-2.5 w-2.5 flex-shrink-0", isActive && "text-primary-foreground")} />
                      {isOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium truncate">{item.label}</span>
                            {item.badge && (
                              <Badge variant={isActive ? "secondary" : "outline"} className="ml-1 text-[10px] px-1 py-0">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className={cn(
                              "text-[10px] mt-0.5 truncate",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {isOpen && (
          <Card variant="elevated" className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Quick Tip</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use Expert mode's Agent Selection to customize AI personalities for your specific use case.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}