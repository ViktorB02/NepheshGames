import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
    const { progress } = useProgress()
    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 100, background: '#1a1410',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'sans-serif',
        }}>
            <div style={{
                width: 100, height: 100, borderRadius: '50%', border: '3px solid #d4a24e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}>
                <div style={{ width: 40, height: 52, background: '#d4a24e',
                    clipPath: 'polygon(50% 0%, 100% 70%, 85% 100%, 15% 100%, 0% 70%)' }} />
            </div>
            <div style={{ color: '#d4a24e', marginTop: 24, fontSize: 18, letterSpacing: 2 }}>{Math.round(progress)}%</div>
            <div style={{ color: '#8a7a5e', marginTop: 8, fontSize: 13, letterSpacing: 3 }}>LOADING ELZORN</div>
            <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }`}</style>
        </div>
    )
}