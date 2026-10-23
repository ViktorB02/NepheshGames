import { useState, useEffect } from 'react'

// Single source of truth for the stacked overlay positions on the home screen.
// TopBar sets its own top/height from these; everything stacked under it derives from them.

// desktop
export const TOPBAR_TOP = 20
export const TOPBAR_HEIGHT = 42

// phone (<= 768px)
export const MOBILE_TOPBAR_TOP = 12
export const MOBILE_TOPBAR_HEIGHT = 35
const MOBILE_TOPBAR_BOTTOM = MOBILE_TOPBAR_TOP + MOBILE_TOPBAR_HEIGHT

const MOBILE_MENU_SIZE = 40
export const MOBILE_COUNTER_TOP = MOBILE_TOPBAR_BOTTOM + 22
export const MOBILE_MENU_TOP = MOBILE_TOPBAR_BOTTOM + 17
export const MOBILE_NAV_TOP = MOBILE_MENU_TOP + MOBILE_MENU_SIZE + 14

// Phone bottom navigation bar (backpack / PREV / NEXT / notebook). Bubbles, cards and the info strip
// anchor to MOBILE_ABOVE_NAVBAR so they sit directly above it and never overlap.
export const MOBILE_NAVBAR_BOTTOM = 10
export const MOBILE_NAVBAR_HEIGHT = 46
export const MOBILE_ABOVE_NAVBAR = `calc(${MOBILE_NAVBAR_BOTTOM + MOBILE_NAVBAR_HEIGHT + 16}px + env(safe-area-inset-bottom))`

// Phone status widget (top-left, below the menu button).
export const MOBILE_STATUS_TOP = MOBILE_NAV_TOP

// Desktop bottom-left row (backpack / notebook / clock strip): bottom 24 + 44px tall. Left panels and the help card
// stop DESKTOP_BOTTOM_CLEARANCE px above the screen bottom, i.e. 12px above that row, and scroll inside instead.
export const DESKTOP_BOTTOM_CLEARANCE = 24 + 44 + 12

// Left panels start at top 24. On narrow desktop windows the centered TopBar
// runs into them, so there they start below the TopBar instead.
const PANEL_TOP = 24
const NARROW_PANEL_TOP = TOPBAR_TOP + TOPBAR_HEIGHT + 16
const NARROW_DESKTOP = '(min-width: 769px) and (max-width: 1250px)'

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

    useEffect(() => {
        const mq = window.matchMedia(query)
        const onChange = (e) => setMatches(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [query])

    return matches
}

// `top` for a left panel plus the matching bottom gap for its maxHeight.
export function usePanelTop() {
    const narrow = useMediaQuery(NARROW_DESKTOP)
    const top = narrow ? NARROW_PANEL_TOP : PANEL_TOP
    return { top, maxHeight: `calc(100vh - ${top + DESKTOP_BOTTOM_CLEARANCE}px)` }
}
