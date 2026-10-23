import useIsMobile from '../hooks/useIsMobile'
import { cardPaddedStyle, CardKeyframes } from './MobileSheet'
import { MOBILE_COUNTER_TOP, usePanelTop } from '../layout'
import MusicButton from './MusicButton'
import MobileHelp from './MobileHelp'
import DesktopHelp from './DesktopHelp'

export function Counter({ discovered, total }) {
    const isMobile = useIsMobile()
    // The music toggle sits just left of the pill, matched to its height.
    return (
        <div style={{
            position: 'absolute', top: 20, right: 20, zIndex: 40,
            display: 'flex', alignItems: 'center', gap: 8,
            ...(isMobile && { top: MOBILE_COUNTER_TOP, right: 12, gap: 6, maxWidth: 'calc(100vw - 24px)' }),
        }}>
            <MusicButton size={isMobile ? 30 : 36} />
            {isMobile ? <MobileHelp /> : <DesktopHelp />}
            <div style={{
                padding: '8px 16px', borderRadius: 20,
                background: '#e8dcc4', border: '1.5px solid #c9922a', color: '#2a1818',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                fontFamily: 'sans-serif', fontSize: 14, fontWeight: 600,
                ...(isMobile && { padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }),
            }}>
                <span style={{ color: '#c9922a' }}>✦</span> {discovered} / {total} Discovered
            </div>
        </div>
    )
}

export function InfoPanel({ data, onClose }) {
    const isMobile = useIsMobile()
    const panel = usePanelTop()
    if (!data) return null
    return (
        <div style={{
            position: 'absolute', top: panel.top, left: 96, width: 320, zIndex: 40,
            padding: '24px 28px', borderRadius: 12,
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            ...(isMobile && cardPaddedStyle),
        }}>
            {isMobile && <CardKeyframes />}
            <div style={{
                fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
                letterSpacing: '0.04em', marginBottom: 6,
                ...(isMobile && { fontSize: 15, marginBottom: 3 }),
            }}>
                {data.title}
            </div>
            <div style={{
                width: 40, height: 1, marginBottom: 16,
                background: 'linear-gradient(to right, #c9922a, transparent)',
                ...(isMobile && { marginBottom: 7 }),
            }} />
            <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.85, fontWeight: 300, ...(isMobile && { fontSize: 12, lineHeight: 1.45 }) }}>
                {data.text}
            </div>
            <div onClick={onClose} style={{
                marginTop: 18, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#c9922a', cursor: 'pointer',
                ...(isMobile && { marginTop: 8, fontSize: 10 }),
            }}>
                ✕ Close
            </div>
        </div>
    )
}
