import { MOBILE_ABOVE_NAVBAR } from '../layout'

// Phone-only bottom-sheet look for the left-side panels. Panels spread
// `sheetStyle` over their desktop style only when useIsMobile() is true.
export const sheetStyle = {
    top: 'auto', left: 0, right: 0, bottom: 0, width: 'auto',
    maxHeight: '60dvh', borderRadius: '16px 16px 0 0', zIndex: 45,
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
    animation: 'sheet-up 0.3s ease',
}

// For panels that scroll their own outer box and carry their own padding.
export const sheetPaddedStyle = {
    ...sheetStyle, overflowY: 'auto', padding: '6px 22px 24px',
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
}

// Phone-only floating card (hotspot info, welcome): inset on all sides, not edge-to-edge. Render <CardKeyframes /> inside the panel.
export const cardStyle = {
    top: 'auto', left: 0, right: 0, bottom: MOBILE_ABOVE_NAVBAR, // sits directly above the bottom nav bar
    margin: '0 auto', width: 'calc(100% - 48px)', maxWidth: 300, boxSizing: 'border-box',
    maxHeight: '26dvh', borderRadius: 14, zIndex: 45,
    animation: 'card-in 0.25s ease',
}

// Same, for panels that scroll their own outer box and carry their own padding.
export const cardPaddedStyle = { ...cardStyle, overflowY: 'auto', padding: '12px 16px 12px' }

export function CardKeyframes() {
    return <style>{`@keyframes card-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }`}</style>
}

// Panel close ✕: same glyph position as before (top 14 / right 18, 16px) inside a 40x40 hit area.
export function PanelClose({ onClose }) {
    return (
        <div onClick={onClose} title="Close" style={{
            position: 'absolute', top: 2, right: 6, width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#8a8478', fontSize: 16, lineHeight: 1,
        }}>✕</div>
    )
}

export function SheetHandle({ onClose }) {
    return (
        <div onClick={onClose} title="Close"
             style={{ flex: 'none', boxSizing: 'border-box', minHeight: 40, padding: '10px 0 6px', cursor: 'pointer' }}>
            <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: none; } }`}</style>
            <div style={{ width: 44, height: 4, margin: '0 auto', borderRadius: 2, background: 'rgba(201,146,42,0.5)' }} />
        </div>
    )
}
