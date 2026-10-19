import { ELZORN_HISTORY } from '../data/history'
import useIsMobile from '../hooks/useIsMobile'
import { PanelClose } from './MobileSheet'
import MobilePagedCard from './MobilePagedCard'
import { usePanelTop } from '../layout'

export default function HistoryPanel({ onClose }) {
    const isMobile = useIsMobile()
    const panel = usePanelTop()
    if (isMobile) {
        // phones: one age per card page
        const pages = ELZORN_HISTORY.map((era) => (
            <div key={era.period}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.03em', color: '#e8b84b', marginBottom: 6 }}>
                    {era.title}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.88, fontWeight: 300 }}>
                    {era.text}
                </div>
            </div>
        ))
        return <MobilePagedCard title="The Ages" subtitle="History of Elzorn" pages={pages} onClose={onClose} />
    }
    return (
        <div style={{
            position: 'absolute', top: panel.top, left: 96, width: 340, zIndex: 40,
            maxHeight: panel.maxHeight, display: 'flex', flexDirection: 'column',
            borderRadius: 12, overflow: 'hidden',
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}>
            <style>{`
                .history-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.5) transparent; }
                .history-scroll::-webkit-scrollbar { width: 6px; }
                .history-scroll::-webkit-scrollbar-track { background: transparent; }
                .history-scroll::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.45); border-radius: 3px; }
                .history-scroll::-webkit-scrollbar-thumb:hover { background: rgba(232,184,75,0.7); }
            `}</style>

            {/* header */}
            <div style={{ padding: '24px 28px 18px', position: 'relative', flex: 'none' }}>
                <PanelClose onClose={onClose} />
                <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
                    letterSpacing: '0.04em', marginBottom: 6,
                }}>
                    The Ages
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a' }}>
                    History of Elzorn
                </div>
                <div style={{ width: 40, height: 1, marginTop: 16, background: 'linear-gradient(to right, #c9922a, transparent)' }} />
            </div>

            {/* timeline */}
            <div className="history-scroll" style={{ overflowY: 'auto', padding: '4px 22px 28px 28px' }}>
                <div style={{ position: 'relative', paddingLeft: 26 }}>
                    <div style={{
                        position: 'absolute', left: 4, top: 8, bottom: 8, width: 1,
                        background: 'linear-gradient(to bottom, rgba(201,146,42,0.6), rgba(201,146,42,0.15))',
                    }} />
                    {ELZORN_HISTORY.map((era, i) => (
                        <div key={era.period} style={{ position: 'relative', marginBottom: i === ELZORN_HISTORY.length - 1 ? 0 : 30 }}>
                            <div style={{
                                position: 'absolute', left: -26, top: 3, width: 9, height: 9, borderRadius: '50%',
                                background: '#c9922a', boxShadow: '0 0 0 3px rgba(26,14,14,0.95), 0 0 8px rgba(232,184,75,0.5)',
                            }} />
                            <div style={{
                                fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600,
                                letterSpacing: '0.03em', color: '#e8b84b', marginBottom: 10,
                            }}>
                                {era.title}
                            </div>
                            <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.88, fontWeight: 300 }}>
                                {era.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
