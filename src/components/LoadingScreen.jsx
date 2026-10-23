import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
    const { progress } = useProgress()
    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 100, background: '#2a1818',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'sans-serif',
        }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: 100, height: 100, overflow: 'visible' }}>
                <circle cx="50" cy="50" r="40" stroke="#c9922a" strokeWidth="2" strokeOpacity="0.45" />
                {/* slow gold arc travelling around the ring */}
                <circle className="elz-arc" cx="50" cy="50" r="40" stroke="#c9922a" strokeWidth="2" strokeLinecap="round" strokeDasharray="62 189.3" />
                <path className="elz-drop" d="M50,18 C62,32 70,47 70,59 C70,70 61,79 50,79 C39,79 30,70 30,59 C30,47 38,32 50,18 Z" fill="#c9922a" />
            </svg>
            <div style={{ color: '#c9922a', marginTop: 24, fontSize: 18, letterSpacing: 2 }}>{Math.round(progress)}%</div>
            <div style={{ color: '#8a7a5e', marginTop: 8, fontSize: 13, letterSpacing: 3 }}>LOADING ELZORN</div>
            <style>{`
                .elz-drop, .elz-arc { transform-box: fill-box; transform-origin: center; }
                .elz-drop { animation: elz-breathe 3.2s ease-in-out infinite; }
                .elz-arc { animation: elz-spin 6s linear infinite; }
                @keyframes elz-breathe {
                    0%, 100% { transform: scale(1); opacity: 0.85; filter: drop-shadow(0 0 0 rgba(201,146,42,0)); }
                    50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 6px rgba(201,146,42,0.55)); }
                }
                @keyframes elz-spin { to { transform: rotate(360deg); } }
                @media (prefers-reduced-motion: reduce) { .elz-drop, .elz-arc { animation: none; } }
            `}</style>
        </div>
    )
}