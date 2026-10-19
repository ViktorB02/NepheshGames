import useIsMobile from '../hooks/useIsMobile'
import MobileMenu from './MobileMenu'

export default function Sidebar({ onOpenHistory, onOpenGameLoop, onOpenWelcome }) {
    const isMobile = useIsMobile()
    if (isMobile) {
        return <MobileMenu onOpenWelcome={onOpenWelcome} onOpenHistory={onOpenHistory} onOpenGameLoop={onOpenGameLoop} />
    }

    const iconStyle = {
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8a8478', cursor: 'pointer', transition: 'color 0.2s', borderRadius: 8,
    }

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 72, zIndex: 40,
            background: 'rgba(26,14,14,0.95)', borderRight: '1px solid rgba(201,146,42,0.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 0', gap: 8,
        }}>
            {/* лого горе */}
            <div style={{ marginBottom: 16, cursor: 'pointer' }} title="Welcome" onClick={onOpenWelcome}>
                <svg viewBox="0 0 100 100" fill="none" style={{ width: 34, height: 34 }}>
                    <circle cx="50" cy="50" r="40" stroke="#c9922a" strokeWidth="2" />
                    <path d="M50,18 C62,32 70,47 70,59 C70,70 61,79 50,79 C39,79 30,70 30,59 C30,47 38,32 50,18 Z" fill="#c9922a" />
                </svg>
            </div>

            {/* часовник */}
            <div style={iconStyle} title="History" onClick={onOpenHistory}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8478')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
            </div>

            {/* книга */}
            <div style={iconStyle} title="Game Loop" onClick={onOpenGameLoop}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8478')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 6c-1.5-1.3-3.7-2-7-2v14c3.3 0 5.5.7 7 2 1.5-1.3 3.7-2 7-2V4c-3.3 0-5.5.7-7 2z" /><path d="M12 6v14" />
                </svg>
            </div>

            <div style={{ flex: 1 }} />

            {/* X (Twitter) */}
            <a href="https://x.com/NepheshGames" target="_blank" rel="noopener noreferrer" style={iconStyle} title="X"
               onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8478')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 2H22l-7.4 8.4L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.9-9L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
                </svg>
            </a>

            {/* Discord */}
            <a href="https://discord.gg/qhY32rVznb" target="_blank" rel="noopener noreferrer" style={iconStyle} title="Discord"
               onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8478')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.2.5a17 17 0 0 1 4.1 1.3 15.7 15.7 0 0 0-13 0A17 17 0 0 1 10.6 3.5L10.4 3a19 19 0 0 0-4.7 1.4A20 20 0 0 0 2 18.3a19 19 0 0 0 5.8 2.9l.4-.6a12 12 0 0 1-1.9-.9l.5-.3a13 13 0 0 0 11.2 0l.5.3a12 12 0 0 1-1.9.9l.4.6a19 19 0 0 0 5.8-2.9 20 20 0 0 0-2.5-13.9zM8.5 15.3c-1 0-1.9-1-1.9-2.1 0-1.2.8-2.1 1.9-2.1s1.9 1 1.9 2.1-.9 2.1-1.9 2.1zm7 0c-1 0-1.9-1-1.9-2.1 0-1.2.8-2.1 1.9-2.1s1.9 1 1.9 2.1-.9 2.1-1.9 2.1z" />
                </svg>
            </a>

            {/* home */}
            <div style={iconStyle} title="Home"
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8478')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
                </svg>
            </div>
        </div>
    )
}