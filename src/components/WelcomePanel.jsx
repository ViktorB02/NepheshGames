import useIsMobile from '../hooks/useIsMobile'
import { cardStyle, CardKeyframes, PanelClose } from './MobileSheet'
import { usePanelTop, MOBILE_ABOVE_NAVBAR } from '../layout'

export default function WelcomePanel({ welcome, onClose }) {
    const isMobile = useIsMobile()
    const panel = usePanelTop()
    const body = {
        fontSize: 14, lineHeight: 1.7, opacity: 0.88, fontWeight: 300, marginBottom: 14,
        ...(isMobile && { fontSize: 12, lineHeight: 1.5, marginBottom: 8 }),
    }

    return (
        <div style={{
            position: 'absolute', top: panel.top, left: 96, width: 340, zIndex: 40,
            maxHeight: panel.maxHeight, display: 'flex', flexDirection: 'column',
            borderRadius: 12, overflow: 'hidden',
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            ...(isMobile && { ...cardStyle, bottom: MOBILE_ABOVE_NAVBAR, maxHeight: '28dvh', maxWidth: 300 }), // compact bubble directly above the bottom nav bar
        }}>
            {isMobile && <CardKeyframes />}
            <style>{`
                .welcome-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.5) transparent; }
                .welcome-scroll::-webkit-scrollbar { width: 6px; }
                .welcome-scroll::-webkit-scrollbar-track { background: transparent; }
                .welcome-scroll::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.45); border-radius: 3px; }
                .welcome-scroll::-webkit-scrollbar-thumb:hover { background: rgba(232,184,75,0.7); }
            `}</style>

            {/* header */}
            <div style={{ padding: '24px 28px 18px', position: 'relative', flex: 'none', ...(isMobile && { padding: '12px 18px 8px' }) }}>
                <PanelClose onClose={onClose} />
                <svg viewBox="0 0 100 100" fill="none" style={{ width: 38, height: 38, marginBottom: 12, ...(isMobile && { width: 24, height: 24, marginBottom: 4 }) }}>
                    <circle cx="50" cy="50" r="40" stroke="#c9922a" strokeWidth="2" />
                    <path d="M50,18 C62,32 70,47 70,59 C70,70 61,79 50,79 C39,79 30,70 30,59 C30,47 38,32 50,18 Z" fill="#c9922a" />
                </svg>
                <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
                    letterSpacing: '0.04em', marginBottom: 6,
                    ...(isMobile && { fontSize: 16, marginBottom: 2 }),
                }}>
                    {welcome.title}
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a', ...(isMobile && { fontSize: 9 }) }}>
                    Lords of Elzorn
                </div>
                <div style={{ width: 40, height: 1, marginTop: 16, background: 'linear-gradient(to right, #c9922a, transparent)', ...(isMobile && { marginTop: 8 }) }} />
            </div>

            <div className="welcome-scroll" style={{ overflowY: 'auto', padding: '4px 22px 28px 28px', ...(isMobile && { padding: '2px 16px 12px 18px' }) }}>
                {welcome.body.map((p) => <div key={p} style={body}>{p}</div>)}
                <div style={{
                    marginTop: 8, paddingTop: 16, textAlign: 'center', fontStyle: 'italic',
                    fontSize: 14, color: '#c9922a', borderTop: '1px solid rgba(201,146,42,0.2)',
                    ...(isMobile && { marginTop: 4, paddingTop: 8, fontSize: 12 }),
                }}>
                    {welcome.closing}
                </div>
            </div>
        </div>
    )
}
