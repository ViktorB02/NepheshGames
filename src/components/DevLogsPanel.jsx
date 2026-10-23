import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import useIsMobile from '../hooks/useIsMobile'
import { DEV_LOGS } from '../data/devLogs'

// Dev Logs postcard modal (opened from the notebook buttons). Same overlay mechanism as HelpButton: portalled to <body>,
// closes on × and on a click outside the card. PREV / NEXT wrap around (page 5 -> 1, page 1 -> 5); opening always starts on page 1
// because the card is unmounted while closed.
// Also the base of InventoryPanel: `pages` / `label` let another panel reuse the same card.
export default function DevLogsPanel({ open, onClose, pages = DEV_LOGS, label = 'Dev Logs' }) {
    if (!open) return null
    return createPortal(<Card onClose={onClose} pages={pages} label={label} />, document.body)
}

function Card({ onClose, pages, label }) {
    const isMobile = useIsMobile()
    const [page, setPage] = useState(0)
    const total = pages.length
    const { title, body, imageSrc } = pages[page]
    const go = (step) => setPage((p) => (p + step + total) % total)

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
            else if (e.key === 'ArrowLeft') go(-1)
            else if (e.key === 'ArrowRight') go(1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const tilt = isMobile ? -1.5 : -2.5
    const btn = {
        flex: 1, height: 40, borderRadius: 100, boxSizing: 'border-box', padding: 0,
        background: '#e8dcc4', border: '1.5px solid #2a1818', color: '#2a1818',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(201,146,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
        fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.12em',
    }
    const chevron = { color: '#c9922a', fontSize: 18, lineHeight: 1 }

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,5,5,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 14 : 24,
        }}>
            <style>{`
                @keyframes devlogs-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
                .devlogs-btn:active { background: #e8b84b !important; }
            `}</style>
            <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label={label} style={{
                position: 'relative', width: '100%', maxWidth: 420, maxHeight: '100%', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                padding: 8, borderRadius: 14, background: '#e8dcc4', border: '1.5px solid #c9922a', color: '#2a1818',
                boxShadow: '0 6px 28px rgba(0,0,0,0.55)', animation: 'devlogs-in 0.2s ease',
            }}>
                {/* thin inner gold border = the double frame */}
                <div style={{
                    position: 'relative', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', boxSizing: 'border-box',
                    padding: isMobile ? '18px 16px 14px' : '22px 24px 18px', borderRadius: 9, border: '1px solid #c9922a',
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div onClick={onClose} title="Close" style={{
                        position: 'absolute', top: 2, right: 4, width: 36, height: 36, cursor: 'pointer', zIndex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#2a1818',
                    }}>×</div>

                    <div style={{
                        flex: 'none', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.3em', color: '#c9922a', textTransform: 'uppercase',
                    }}>{label}</div>

                    {/* tilted "photo" */}
                    <div style={{ flex: 'none', padding: isMobile ? '16px 6px 14px' : '20px 10px 18px' }}>
                        <div style={{
                            transform: `rotate(${tilt}deg)`, aspectRatio: '16 / 10', width: '100%', boxSizing: 'border-box',
                            background: '#f3ead6', padding: 6, border: '1px solid rgba(201,146,42,0.6)',
                            boxShadow: '0 4px 12px rgba(42,24,24,0.35)',
                        }}>
                            {imageSrc
                                ? <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                : <div style={{
                                    width: '100%', height: '100%', boxSizing: 'border-box', border: '1px solid #c9922a',
                                    background: 'rgba(201,146,42,0.12)', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', padding: 8,
                                }}>
                                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14, letterSpacing: '0.06em' }}>{title}</span>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, opacity: 0.65 }}>Screenshot coming soon</span>
                                </div>}
                        </div>
                    </div>

                    <div style={{ flex: 'none', fontFamily: "'Cinzel', serif", fontSize: isMobile ? 20 : 22, fontWeight: 700, letterSpacing: '0.04em', textAlign: 'center' }}>
                        {title}
                    </div>
                    <div style={{ flex: 'none', width: 40, height: 1, margin: '8px auto 10px', background: 'linear-gradient(to right, transparent, #c9922a, transparent)' }} />
                    <p style={{ flex: 'none', margin: 0, textAlign: 'center', fontFamily: "'Lora', serif", fontSize: isMobile ? 14 : 15, lineHeight: 1.5 }}>{body}</p>

                    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
                        <button type="button" className="devlogs-btn" aria-label="Previous page" style={btn} onClick={() => go(-1)}>
                            <span style={chevron}>‹</span> PREV
                        </button>
                        <span style={{ flex: 'none', minWidth: 44, textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em' }}>
                            {page + 1} / {total}
                        </span>
                        <button type="button" className="devlogs-btn" aria-label="Next page" style={btn} onClick={() => go(1)}>
                            NEXT <span style={chevron}>›</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
