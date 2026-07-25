"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Reactive mobile breakpoint detection hook.
 *
 * Listens to the `(max-width: 767px)` media query and returns `true`
 * when the viewport is narrower than 768px. Updates on resize via
 * `matchMedia` change events.
 *
 * Computes the initial value synchronously from the current window width
 * to avoid a flash of incorrect layout. Returns `false` during SSR.
 *
 * @returns `true` when viewport width is below the mobile breakpoint
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
