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

const LARGE_BREAKPOINT = 1024

/**
 * Reactive large-screen breakpoint detection hook.
 *
 * Listens to the `(min-width: 1024px)` media query (Tailwind's `lg`) and
 * returns `true` when the viewport is at least 1024px wide. Updates on resize
 * via `matchMedia` change events.
 *
 * Computes the initial value synchronously from the current window width to
 * avoid a flash of incorrect layout. Returns `false` during SSR, matching the
 * server-rendered (mobile-first) markup.
 *
 * @returns `true` when viewport width is at or above the `lg` breakpoint
 */
export function useIsLargeScreen() {
  const [isLarge, setIsLarge] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth >= LARGE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LARGE_BREAKPOINT}px)`)
    const onChange = () => {
      setIsLarge(window.innerWidth >= LARGE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isLarge
}
