import { useState } from 'react'
import { MOBILE_MENU_TOP } from '../layout'

const stroke = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }

// Phone replacement for the vertical Sidebar: a hamburger that opens a dropdown.
export default function MobileMenu({ onOpenWelcome, onOpenHistory, onOpenGameLoop }) {
    const [open, setOpen] = useState(false)

    const items = [
        {
            label: 'Welcome', action: onOpenWelcome,
            icon: (
                <svg viewBox="0 0 100 100" fill="none" style={{ width: 20, height: 20 }}>
                    <circle cx="50" cy="50" r="40" stroke="#c9922a" strokeWidth="6" />
                    <path d="M50,18 C62,32 70,47 70,59 C70,70 61,79 50,79 C39,79 30,70 30,59 C30,47 38,32 50,18 Z" fill="#c9922a" />
                </svg>
            ),
        },
        {
            label: 'History', action: onOpenHistory,
            icon: <svg {...stroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
        },
        {
            label: 'Game Loop', action: onOpenGameLoop,
            icon: <svg {...stroke}><path d="M12 6c-1.5-1.3-3.7-2-7-2v14c3.3 0 5.5.7 7 2 1.5-1.3 3.7-2 7-2V4c-3.3 0-5.5.7-7 2z" /><path d="M12 6v12" /></svg>,
        },
        {
            label: 'X', href: 'https://x.com/NepheshGames', newTab: true,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 2H22l-7.4 8.4L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.9-9L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
                </svg>
            ),
        },
        {
            label: 'Discord', href: 'https://discord.gg/qhY32rVznb', newTab: true,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.2.5a17 17 0 0 1 4.1 1.3 15.7 15.7 0 0 0-13 0A17 17 0 0 1 10.6 3.5L10.4 3a19 19 0 0 0-4.7 1.4A20 20 0 0 0 2 18.3a19 19 0 0 0 5.8 2.9l.4-.6a12 12 0 0 1-1.9-.9l.5-.3a13 13 0 0 0 11.2 0l.5.3a12 12 0 0 1-1.9.9l.4.6a19 19 0 0 0 5.8-2.9 20 20 0 0 0-2.5-13.9zM8.5 15.3c-1 0-1.9-1-1.9-2.1 0-1.2.8-2.1 1.9-2.1s1.9 1 1.9 2.1-.9 2.1-1.9 2.1zm7 0c-1 0-1.9-1-1.9-2.1 0-1.2.8-2.1 1.9-2.1s1.9 1 1.9 2.1-.9 2.1-1.9 2.1z" />
                </svg>
            ),
        },
        {
            label: 'Home',
            icon: <svg {...stroke}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>,
        },
    ]

    const row = {
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
        color: '#e2ddd0', textDecoration: 'none', cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", fontSize: 14,
    }

    const run = (item) => {
        setOpen(false)
        item.action?.()
    }

    return (
        <>
            {open && <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, zIndex: 48 }} />}
            <div style={{ position: 'absolute', top: MOBILE_MENU_TOP, left: 12, zIndex: 49 }}>
                <div onClick={() => setOpen(!open)} aria-label="Menu" style={{
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10, cursor: 'pointer', fontSize: 22, color: '#e8b84b',
                    background: 'rgba(26,14,14,0.95)', border: '1px solid rgba(201,146,42,0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}>
                    {open ? '✕' : '☰'}
                </div>
                {open && (
                    <div style={{
                        position: 'absolute', top: 48, left: 0, minWidth: 180, overflow: 'hidden',
                        borderRadius: 12, background: 'rgba(26,14,14,0.97)',
                        border: '1px solid rgba(201,146,42,0.25)', boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
                    }}>
                        {items.map((item) => {
                            const content = (
                                <>
                                    <span style={{ color: '#c9922a', width: 22, display: 'flex', justifyContent: 'center' }}>{item.icon}</span>
                                    {item.label}
                                </>
                            )
                            return item.href
                                ? <a key={item.label} href={item.href} {...(item.newTab && { target: '_blank', rel: 'noopener noreferrer' })} style={row} onClick={() => setOpen(false)}>{content}</a>
                                : <div key={item.label} style={row} onClick={() => run(item)}>{content}</div>
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
