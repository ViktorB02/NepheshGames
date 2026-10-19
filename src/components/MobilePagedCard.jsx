import { useState } from 'react'
import { cardStyle, CardKeyframes, PanelClose } from './MobileSheet'

// Phone-only floating card that shows ONE page at a time with Back / Next and a "n / total" indicator.
// Panels render it only when useIsMobile() is true; it mounts when the panel opens, so it always starts on page 1.
// `pages` is an array of React nodes (one per page).
export default function MobilePagedCard({ title, subtitle, pages, onClose }) {
    const [page, setPage] = useState(0)
    const last = pages.length - 1

    const navBtn = (enabled) => ({
        flex: 'none', minWidth: 72, padding: '8px 14px', borderRadius: 8, textAlign: 'center',
        fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: enabled ? 'pointer' : 'default', userSelect: 'none',
        color: enabled ? '#1a0e0e' : '#6f6a5f',
        background: enabled ? 'linear-gradient(180deg, #e8b84b, #c9922a)' : 'transparent',
        border: `1px solid ${enabled ? '#e8b84b' : 'rgba(201,146,42,0.25)'}`,
    })

    return (
        <div style={{
            position: 'absolute', zIndex: 45, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            ...cardStyle, bottom: 'calc(40px + env(safe-area-inset-bottom))', maxHeight: '44dvh', maxWidth: 340,
        }}>
            <CardKeyframes />

            <div style={{ padding: '14px 18px 8px', position: 'relative', flex: 'none' }}>
                <PanelClose onClose={onClose} />
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>
                    {title}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a' }}>
                    {subtitle}
                </div>
                <div style={{ width: 40, height: 1, marginTop: 8, background: 'linear-gradient(to right, #c9922a, transparent)' }} />
            </div>

            <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '2px 18px 10px' }}>
                {pages[page]}
            </div>

            <div style={{
                flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 18px 12px', borderTop: '1px solid rgba(201,146,42,0.15)',
            }}>
                <div onClick={() => page > 0 && setPage(page - 1)} style={navBtn(page > 0)}>Back</div>
                <div style={{ fontSize: 12, letterSpacing: '0.1em', color: '#c9922a' }}>{page + 1} / {pages.length}</div>
                <div onClick={() => page < last && setPage(page + 1)} style={navBtn(page < last)}>Next</div>
            </div>
        </div>
    )
}
