import { useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'
import { sheetPaddedStyle, SheetHandle, PanelClose } from './MobileSheet'
import { MOBILE_ABOVE_NAVBAR } from '../layout'
import { usePanelTop } from '../layout'

const avatarUrl = (name) =>
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=3a2222`

function Avatar({ name }) {
    const [failed, setFailed] = useState(false)
    const box = {
        width: 56, height: 56, borderRadius: '50%', flex: 'none', overflow: 'hidden',
        border: '2px solid #c9922a', background: '#3a2222',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    }
    if (failed) {
        return <div style={{ ...box, color: '#e8b84b', fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700 }}>{name[0]}</div>
    }
    return (
        <div style={box}>
            <img src={avatarUrl(name)} alt={name} width={56} height={56}
                 onError={() => setFailed(true)} style={{ display: 'block' }} />
        </div>
    )
}

export default function StoryPanel({ story, step, onStep, onClose }) {
    const isMobile = useIsMobile()
    const panel = usePanelTop()
    const current = story[step]
    const isFirst = step === 0
    const isLast = step === story.length - 1

    const btn = {
        padding: '8px 18px', borderRadius: 100, border: '1px solid #c9922a',
        background: 'rgba(201,146,42,0.15)', color: '#e8b84b', cursor: 'pointer',
        fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
    }

    return (
        <div style={{
            position: 'absolute', top: panel.top, left: 96, width: 320, zIndex: 40,
            padding: '24px 28px', borderRadius: 12,
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            color: '#e2ddd0', fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            ...(!isMobile && { display: 'flex', flexDirection: 'column', boxSizing: 'border-box', maxHeight: panel.maxHeight }), // bounded: the text scrolls inside, the Prev/Next row stays visible
            ...(isMobile && { ...sheetPaddedStyle, bottom: MOBILE_ABOVE_NAVBAR, borderRadius: 14, paddingBottom: 18, maxHeight: '50dvh' }), // lifted so the bottom nav bar stays visible
        }}>
            {isMobile && <SheetHandle onClose={onClose} />}
            <style>{`
                @keyframes story-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
                .story-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.5) transparent; }
                .story-scroll::-webkit-scrollbar { width: 6px; }
                .story-scroll::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.45); border-radius: 3px; }
            `}</style>

            <PanelClose onClose={onClose} />

            {/* key={step} replays the fade-in on every step */}
            <div key={step} className="story-scroll" style={{ animation: 'story-in 0.3s ease', ...(!isMobile && { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, paddingRight: 16 }}>
                    <Avatar name={current.speaker} />
                    <div style={{
                        fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700,
                        letterSpacing: '0.04em', color: '#e8b84b', lineHeight: 1.3,
                    }}>
                        {current.speaker}
                    </div>
                </div>
                <div style={{ width: 40, height: 1, marginBottom: 16, background: 'linear-gradient(to right, #c9922a, transparent)' }} />
                <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, fontWeight: 300, minHeight: 120 }}>
                    {current.text}
                </div>
            </div>

            <div style={{ marginTop: 20, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {!isFirst && <button style={btn} onClick={() => onStep(step - 1)}>← Prev</button>}
                    <span style={{ fontSize: 12, color: '#8a8478', letterSpacing: '0.1em' }}>
                        {step + 1} / {story.length}
                    </span>
                </div>
                {isLast
                    ? <button style={btn} onClick={onClose}>Close</button>
                    : <button style={btn} onClick={() => onStep(step + 1)}>Next →</button>}
            </div>
        </div>
    )
}
