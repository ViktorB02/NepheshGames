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
    return { top, maxHeight: `calc(100vh - ${top + 24}px)` }
}
