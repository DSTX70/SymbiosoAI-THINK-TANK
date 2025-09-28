import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Guard against SSR and environments without window/matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Set initial value
    setIsMobile(mql.matches)
    
    // Add listener for media query changes (handles orientation changes)
    mql.addEventListener("change", onChange)
    
    // Also listen for resize events to catch edge cases
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}
