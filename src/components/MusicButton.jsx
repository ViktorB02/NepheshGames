import { useMusic } from './MusicContext'

// Round mute / unmute toggle (white speaker icon on a bordo disc with a gold rim).
// `size` is the diameter in px; pass `floating` for a fixed bottom-right placement, otherwise it is an inline element.
export default function MusicButton({ size = 34, floating = false }) {
    const { muted, toggle } = useMusic()
    const icon = Math.round(size * 0.55)
    return (
        <button
            onClick={toggle}
            title={muted ? 'Unmute music' : 'Mute music'}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            aria-pressed={muted}
            style={{
                flex: 'none', width: size, height: size, borderRadius: '50%', padding: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(42,24,24,0.92)', border: '1px solid rgba(201,146,42,0.5)', color: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                ...(floating && { position: 'fixed', right: 14, bottom: 'calc(14px + env(safe-area-inset-bottom))', zIndex: 30 }),
            }}
        >
            <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
                {muted ? (
                    <>
                        <line x1="16" y1="9" x2="22" y2="15" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                    </>
                ) : (
                    <>
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                    </>
                )}
            </svg>
        </button>
    )
}
