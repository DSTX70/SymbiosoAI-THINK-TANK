/**
 * Responsive Design Utilities
 * Provides consistent mobile/desktop behavior across components
 */

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Responsive size mapping for components
 */
export const responsiveSizes = {
  button: {
    desktop: "default" as const,
    mobile: "sm" as const,
  },
  card: {
    desktop: "default" as const,
    mobile: "sm" as const,
  },
  modal: {
    desktop: "lg" as const,
    mobile: "full" as const,
  },
  text: {
    desktop: "base" as const,
    mobile: "sm" as const,
  },
};

/**
 * Get responsive size based on current screen size
 */
export function useResponsiveSize<T extends keyof typeof responsiveSizes>(
  component: T
): typeof responsiveSizes[T]["desktop"] | typeof responsiveSizes[T]["mobile"] {
  const isMobile = useIsMobile();
  return isMobile ? responsiveSizes[component].mobile : responsiveSizes[component].desktop;
}

/**
 * Responsive spacing utilities
 */
export const responsiveSpacing = {
  container: "px-4 md:px-6 lg:px-8",
  section: "py-6 md:py-8 lg:py-12",
  card: "p-4 md:p-6",
  gap: "gap-4 md:gap-6",
  grid: {
    default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    two: "grid-cols-1 md:grid-cols-2",
    three: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    four: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },
};

/**
 * Mobile-optimized interaction patterns
 */
export const mobileOptimizations = {
  touchTarget: "min-h-[44px] min-w-[44px]", // iOS HIG recommended minimum
  tapPadding: "p-3 md:p-2", // Larger padding on mobile for easier tapping
  fontSize: "text-base md:text-sm", // Larger text on mobile for readability
  spacing: "space-y-4 md:space-y-3", // More spacing on mobile
};

/**
 * Responsive component class utilities
 */
export function getResponsiveClasses(config: {
  mobile?: string;
  desktop?: string;
  base?: string;
}) {
  const { mobile = "", desktop = "", base = "" } = config;
  return `${base} ${mobile} md:${desktop}`.trim();
}

/**
 * Navigation patterns for mobile vs desktop
 */
export const navigationPatterns = {
  mobile: {
    position: "fixed bottom-0 left-0 right-0",
    layout: "flex flex-row justify-around",
    itemSize: "flex-1 py-2",
    hideLabels: false,
  },
  desktop: {
    position: "relative",
    layout: "flex flex-col",
    itemSize: "px-4 py-2",
    hideLabels: false,
  },
};

/**
 * Modal behavior patterns
 */
export const modalPatterns = {
  mobile: {
    container: "fixed inset-0 z-50",
    content: "h-full w-full rounded-none",
    animation: "slide-up",
  },
  desktop: {
    container: "fixed inset-0 z-50 flex items-center justify-center",
    content: "max-w-lg w-full m-4 rounded-lg",
    animation: "fade-scale",
  },
};