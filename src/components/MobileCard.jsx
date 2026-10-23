import { cardStyle, CardKeyframes, PanelClose } from './MobileSheet'
import { MOBILE_ABOVE_NAVBAR } from '../layout'

// Phone-only floating card for the long panels (History, GameLoop): header + one scrollable body.
// Panels render it only when useIsMobile() is true.
export default function MobileCard({ title, subtitle, onClose, children }) {
    return (
        <div style={{
            position: 'absolute', zIndex: 45, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            ...cardStyle, bottom: MOBILE_ABOVE_NAVBAR, maxHeight: '40dvh', maxWidth: 340,
        }}>
            <CardKeyframes />
            <style>{`
                .mcard-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.5) transparent; }
                .mcard-scroll::-webkit-scrollbar { width: 5px; }
                .mcard-scroll::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.45); border-radius: 3px; }
            `}</style>

            <div style={{ padding: '12px 18px 6px', position: 'relative', flex: 'none' }}>
                <PanelClose onClose={onClose} />
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>
                    {title}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a' }}>
                    {subtitle}
                </div>
                <div style={{ width: 40, height: 1, marginTop: 6, background: 'linear-gradient(to right, #c9922a, transparent)' }} />
            </div>

            <div className="mcard-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '2px 16px 14px 18px' }}>
                {children}
            </div>
        </div>
    )
}
