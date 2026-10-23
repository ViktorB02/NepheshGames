import { useState } from 'react'
import { createPortal } from 'react-dom'

// Round cream "?" button + a centred "How to explore" card. Shared by the phone and desktop help buttons:
// the caller supplies the `tips` and the button `size`. The button is inline (it lives in the Counter row); the card is portalled
// to <body> so it overlays everything regardless of the row's stacking context. `clearance` (desktop only) is the px the
// card must stay away from the top and bottom of the screen; a taller card then scrolls its list instead of growing. Tap / click outside or the × to close.
export default function HelpButton({ tips, size = 32, clearance }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button type="button" aria-label="How to explore" onClick={() => setOpen(true)} style={{
                flex: 'none', width: size, height: size, borderRadius: '50%', padding: 0,
                background: '#e8dcc4', border: '1.5px solid #c9922a', color: '#2a1818',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: Math.round(size / 2), lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>?</button>

            {open && createPortal(
                <div onClick={() => setOpen(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,5,5,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                }}>
                    <style>{`@keyframes help-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }`}</style>
                    <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="How to explore" style={{
                        position: 'relative', width: '100%', maxWidth: 300, boxSizing: 'border-box', padding: '18px 20px 16px',
                        borderRadius: 14, background: '#e8dcc4', border: '1.5px solid #2a1818', color: '#2a1818',
                        boxShadow: '0 6px 28px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(201,146,42,0.55)',
                        animation: 'help-in 0.2s ease',
                        ...(clearance != null && { display: 'flex', flexDirection: 'column', maxHeight: `calc(100% - ${2 * clearance - 48}px)` }),
                    }}>
                        <div onClick={() => setOpen(false)} title="Close" style={{
                            position: 'absolute', top: 2, right: 4, width: 36, height: 36, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#2a1818',
                        }}>×</div>
                        <div style={{ flex: 'none', fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', paddingRight: 22 }}>
                            How to explore
                        </div>
                        <div style={{ flex: 'none', width: 40, height: 1, margin: '8px 0 12px', background: 'linear-gradient(to right, #c9922a, transparent)' }} />
                        <ul style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.45 }}>
                            {tips.map((t) => (
                                <li key={t} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <span style={{ color: '#c9922a', flex: 'none' }}>✦</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>,
                document.body,
            )}
        </>
    )
}
