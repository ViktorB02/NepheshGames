const STEPS = [
    { title: 'Hunt', text: 'Battle mobs and bosses across the island for loot and gold.' },
    { title: 'Gather', text: 'Mine ore and chop wood to collect crafting materials.' },
    { title: 'Upgrade', text: 'Forge stronger gear at the blacksmith and keep your weapons sharp.' },
    { title: 'Level Up', text: 'Climb from 1 to 100, unlock abilities and master your weapon of choice.' },
    { title: 'Go to War', text: 'Join your kingdom and fight for territory: Humans against Orcs.' },
]

import useIsMobile from '../hooks/useIsMobile'
import { PanelClose } from './MobileSheet'
import MobileCard from './MobileCard'
import { usePanelTop } from '../layout'

export default function GameLoopPanel({ onClose }) {
    const isMobile = useIsMobile()
    const panel = usePanelTop()
    if (isMobile) {
        // phones: every step in one compact scrollable card (no numbered badges)
        return (
            <MobileCard title="How You Play" subtitle="The Loop of Elzorn" onClose={onClose}>
                <div style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.88, fontWeight: 300, marginBottom: 10 }}>
                    Every hero of Elzorn lives the same cycle. Master it, and the kingdom is yours.
                </div>
                {STEPS.map((s) => (
                    <div key={s.title} style={{ marginBottom: 9 }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', color: '#e8b84b', marginBottom: 2 }}>
                            {s.title}
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.88, fontWeight: 300 }}>
                            {s.text}
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: 4, paddingTop: 8, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#c9922a', borderTop: '1px solid rgba(201,146,42,0.2)' }}>
                    Then do it all again, stronger than before.
                </div>
            </MobileCard>
        )
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
                .loop-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.5) transparent; }
                .loop-scroll::-webkit-scrollbar { width: 6px; }
                .loop-scroll::-webkit-scrollbar-track { background: transparent; }
                .loop-scroll::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.45); border-radius: 3px; }
                .loop-scroll::-webkit-scrollbar-thumb:hover { background: rgba(232,184,75,0.7); }
            `}</style>

            {/* header */}
            <div style={{ padding: '24px 28px 18px', position: 'relative', flex: 'none' }}>
                <PanelClose onClose={onClose} />
                <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
                    letterSpacing: '0.04em', marginBottom: 6,
                }}>
                    How You Play
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a' }}>
                    The Loop of Elzorn
                </div>
                <div style={{ width: 40, height: 1, marginTop: 16, background: 'linear-gradient(to right, #c9922a, transparent)' }} />
            </div>

            <div className="loop-scroll" style={{ overflowY: 'auto', padding: '4px 22px 28px 28px' }}>
                <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.88, fontWeight: 300, marginBottom: 22 }}>
                    Every hero of Elzorn lives the same cycle. Master it, and the kingdom is yours.
                </div>

                {STEPS.map((s, i) => (
                    <div key={s.title} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                        <div style={{
                            flex: 'none', width: 28, height: 28, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
                            color: '#1a0e0e', background: 'linear-gradient(180deg, #e8b84b, #c9922a)',
                            boxShadow: '0 0 8px rgba(232,184,75,0.35)',
                        }}>
                            {i + 1}
                        </div>
                        <div>
                            <div style={{
                                fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700,
                                letterSpacing: '0.03em', color: '#e8b84b', marginBottom: 4,
                            }}>
                                {s.title}
                            </div>
                            <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.88, fontWeight: 300 }}>
                                {s.text}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{
                    marginTop: 8, paddingTop: 16, textAlign: 'center', fontStyle: 'italic',
                    fontSize: 14, color: '#c9922a', borderTop: '1px solid rgba(201,146,42,0.2)',
                }}>
                    Then do it all again, stronger than before.
                </div>
            </div>
        </div>
    )
}
