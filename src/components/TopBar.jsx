import { useState } from 'react'
import { Link } from 'react-router-dom'
import DonateModal from './DonateModal'
import useIsMobile from '../hooks/useIsMobile'
import { TOPBAR_TOP, TOPBAR_HEIGHT, MOBILE_TOPBAR_TOP, MOBILE_TOPBAR_HEIGHT } from '../layout'

export default function TopBar() {
    const [donateOpen, setDonateOpen] = useState(false)
    const isMobile = useIsMobile()

    const link = {
        color: '#e8dcc4', textDecoration: 'none',
        fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: "'Inter', sans-serif", fontWeight: 500,
        transition: 'color 0.2s', cursor: 'pointer',
        ...(isMobile && { fontSize: 11, letterSpacing: '0.05em', whiteSpace: 'nowrap' }),
    }

    return (
        <div style={{
            position: 'absolute', top: TOPBAR_TOP, height: TOPBAR_HEIGHT, left: '50%', transform: 'translateX(-50%)',
            zIndex: 40,
            display: 'flex', alignItems: 'center', gap: 36,
            padding: '12px 28px', borderRadius: 100,
            background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            ...(isMobile && { top: MOBILE_TOPBAR_TOP, height: MOBILE_TOPBAR_HEIGHT, gap: 16, padding: '10px 18px', maxWidth: 'calc(100vw - 24px)' }),
        }}>
            <Link to="/about" style={link}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#e8dcc4')}>
                About Us
            </Link>
            <a href="#" style={link}
               onClick={(e) => { e.preventDefault(); setDonateOpen(true) }}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#e8dcc4')}>
                Donate
            </a>
            <Link to="/apply" style={link}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b84b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#e8dcc4')}>
                Apply for Job
            </Link>
            {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
        </div>
    )
}