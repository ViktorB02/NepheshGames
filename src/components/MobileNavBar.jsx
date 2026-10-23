import { MAPS } from '../data/hotspots'
import { MOBILE_NAVBAR_BOTTOM, MOBILE_NAVBAR_HEIGHT } from '../layout'

// Phone-only bottom bar: [backpack] [‹ PREV] [NEXT ›] [notebook].
// PREV / NEXT cycle through MAPS and wrap around (map 3 -> 1, map 1 -> 3) via the same onSelect as the desktop RegionNav.
// Rendered by Home only when useIsMobile() is true.
export default function MobileNavBar({ activeRegion, onSelect }) {
    const idx = Math.max(0, MAPS.findIndex((m) => m.id === activeRegion))
    const go = (step) => onSelect(MAPS[(idx + step + MAPS.length) % MAPS.length].id)

    const base = {
        height: MOBILE_NAVBAR_HEIGHT, borderRadius: 100, boxSizing: 'border-box',
        background: '#e8dcc4', border: '1.5px solid #2a1818', color: '#2a1818',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
        boxShadow: '0 2px 10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(201,146,42,0.55)',
        padding: 0, font: 'inherit',
    }
    const icon = { ...base, width: MOBILE_NAVBAR_HEIGHT, flex: 'none' }
    const label = {
        ...base, flex: 1, gap: 6,
        fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14, letterSpacing: '0.12em',
    }
    const chevron = { color: '#c9922a', fontSize: 18, lineHeight: 1 }

    return (
        <div style={{
            position: 'absolute', zIndex: 46, left: 0, right: 0,
            bottom: `calc(${MOBILE_NAVBAR_BOTTOM}px + env(safe-area-inset-bottom))`,
            display: 'flex', gap: 8, alignItems: 'center',
            width: 'calc(100% - 24px)', maxWidth: 380, margin: '0 auto',
        }}>
            <style>{`.mnav-btn:active { background: #e8b84b !important; }`}</style>

            {/* TODO: wire the backpack (inventory) button to its panel; visual only for now */}
            <button type="button" className="mnav-btn" aria-label="Backpack" style={icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9922a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 4.5a3 3 0 0 1 6 0" />
                    <path d="M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v9.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5V9z" />
                    <path d="M9 13h6v3.5H9z" />
                    <path d="M6 11.5H4.5M18 11.5h1.5" />
                </svg>
            </button>

            <button type="button" className="mnav-btn" aria-label="Previous map" style={label} onClick={() => go(-1)}>
                <span style={chevron}>‹</span> PREV
            </button>
            <button type="button" className="mnav-btn" aria-label="Next map" style={label} onClick={() => go(1)}>
                NEXT <span style={chevron}>›</span>
            </button>

            {/* TODO: wire the notebook (journal) button to its panel; visual only for now */}
            <button type="button" className="mnav-btn" aria-label="Notebook" style={icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9922a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="3.5" width="12.5" height="17" rx="1.5" />
                    <path d="M6 7H4M6 12H4M6 17H4" />
                    <path d="M10 8h5.5M10 11.5h5.5M10 15h3" />
                </svg>
            </button>
        </div>
    )
}
