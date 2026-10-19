import { useState, useEffect } from 'react'

import useIsMobile from '../hooks/useIsMobile'

export default function BottomBar({ onOpenStory, hidden }) {
    const [time, setTime] = useState('')
    const isMobile = useIsMobile()

    useEffect(() => {
        const update = () => {
            const now = new Date().toLocaleTimeString('en-GB', {
                timeZone: 'Europe/Warsaw',
                hour: '2-digit', minute: '2-digit',
            })
            setTime(now)
        }
        update()
        const t = setInterval(update, 1000 * 30)
        return () => clearInterval(t)
    }, [])

    const pill = {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 100,
        background: 'rgba(26,14,14,0.9)', border: '1px solid rgba(201,146,42,0.2)',
        color: '#e2ddd0', fontFamily: "'Inter', sans-serif", fontSize: 14,
        ...(isMobile && { padding: '7px 12px', gap: 6, fontSize: 12, whiteSpace: 'nowrap', pointerEvents: 'auto' }),
    }

    // phone: the bar would sit under a bottom sheet, so it hides while one is open
    if (isMobile && hidden) return null

    return (
        <div style={{
            position: 'absolute', bottom: 24, right: 60,
            zIndex: 40, display: 'flex', gap: 12,
            // phone: full-width strip so pills centre and wrap instead of overflowing;
            // the strip ignores touches so the map stays draggable around the pills
            ...(isMobile && {
                bottom: 'calc(14px + env(safe-area-inset-bottom))', right: 'auto', left: '50%',
                transform: 'translateX(-50%)', gap: 8,
                width: 'calc(100vw - 24px)', maxWidth: 'calc(100vw - 24px)',
                flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'none',
            }),
        }}>
            {/* часовник + температура */}
            <div style={pill}>
                {/* сонце иконка */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9922a" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
                </svg>
                <span>{time}</span>
                <span style={{ opacity: 0.3, margin: '0 4px' }}>|</span>
                <span style={{ color: '#c9922a' }}>🌡</span>
                <span>18°C / 64°F</span>
            </div>

            {/* лик-водич */}
            {onOpenStory && <div style={{ ...pill, cursor: 'pointer' }} title="Guide" onClick={onOpenStory}>
                <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(201,146,42,0.2)', border: '1px solid rgba(201,146,42,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                    👤
                </div>
                <span>Informations</span>
            </div>}
        </div>
    )
}