import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const GUMROAD_URL = 'https://elzorn.gumroad.com/l/founders_support'

const GOLD = '#c9922a'
const GOLD_LIGHT = '#e8b84b'

const TIERS = [
    { price: 10, name: 'Knight' },
    { price: 25, name: 'Baron' },
    { price: 50, name: 'Lord' },
]

const REWARDS = [
    'Have your name on the Supporters Wall',
    'Receive a Supporter role in our Discord',
    "Get early access to new regions as they're built",
]

const css = `
.donate-tiers { display: flex; gap: 12px; margin-bottom: 18px; }
.donate-tier {
    flex: 1; text-align: center; padding: 12px 8px; border-radius: 8px;
    border: 1px solid rgba(201,146,42,0.5); background: rgba(201,146,42,0.06);
    color: ${GOLD_LIGHT}; text-decoration: none; font-family: 'Cinzel', serif;
    font-size: 14px; font-weight: 600; letter-spacing: 0.04em; transition: all 0.2s;
}
.donate-tier:hover { background: rgba(201,146,42,0.2); border-color: ${GOLD_LIGHT}; }
.donate-cta {
    display: block; text-align: center; padding: 15px 20px; border-radius: 8px;
    background: linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD}); color: #1a0e0e;
    text-decoration: none; font-family: 'Cinzel', serif; font-weight: 700;
    font-size: 15px; letter-spacing: 0.08em; transition: filter 0.2s;
}
.donate-cta:hover { filter: brightness(1.12); }
.donate-close:hover { color: ${GOLD_LIGHT}; }
@media (max-width: 768px) { .donate-tiers { flex-direction: column; } }
`

export default function DonateModal({ onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    const pill = {
        padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.14em', color: GOLD_LIGHT,
        border: '1px solid rgba(201,146,42,0.4)', background: 'rgba(201,146,42,0.08)',
    }

    return createPortal(
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, overflowY: 'auto',
        }}>
            <style>{css}</style>
            <div role="dialog" aria-modal="true" aria-labelledby="donate-title"
                 onClick={(e) => e.stopPropagation()}
                 style={{
                     position: 'relative', width: '100%', maxWidth: 560, margin: 'auto',
                     padding: '40px 32px 28px', borderRadius: 14,
                     background: 'linear-gradient(180deg, #241515, #1a0e0e)',
                     border: `1px solid ${GOLD}`, boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                     color: '#e8dcc4', fontFamily: "'Inter', sans-serif",
                 }}>
                <button className="donate-close" onClick={onClose} aria-label="Close"
                        style={{
                            position: 'absolute', top: 12, right: 14, background: 'none',
                            border: 'none', color: '#a89878', fontSize: 20, cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}>
                    ✕
                </button>

                <h2 id="donate-title" style={{
                    margin: '0 0 14px', textAlign: 'center', color: '#f2e8d0',
                    fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.25,
                }}>
                    Become a <span style={{ color: GOLD_LIGHT }}>Founding Supporter</span>
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                    {['ONE-TIME', 'NO SUBSCRIPTION', 'SUPPORTERS WALL'].map((t) => (
                        <span key={t} style={pill}>{t}</span>
                    ))}
                </div>

                <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.7, color: '#d6c9ad' }}>
                    Lords of Elzorn is built by a tiny team, on late nights and a belief that worlds
                    should feel alive. Founding Supporters help fund the next stage: new regions,
                    original artwork, and the road to Steam.
                </p>

                <div style={{
                    margin: '0 0 22px', padding: '14px 18px', borderRadius: '0 8px 8px 0',
                    borderLeft: `3px solid ${GOLD}`, background: 'rgba(201,146,42,0.07)',
                    fontSize: 14, lineHeight: 1.7,
                }}>
                    <div style={{ marginBottom: 6, color: GOLD_LIGHT, fontWeight: 600 }}>
                        As a Founding Supporter, you will:
                    </div>
                    {REWARDS.map((r) => (
                        <div key={r}>• {r}</div>
                    ))}
                </div>

                <div className="donate-tiers">
                    {TIERS.map(({ price, name }) => (
                        <a key={price} className="donate-tier"
                           href={`${GUMROAD_URL}?price=${price}`}
                           target="_blank" rel="noopener noreferrer">
                            ${price} — {name}
                        </a>
                    ))}
                </div>

                <a className="donate-cta" href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">
                    ♥ Support Lords of Elzorn
                </a>

                <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: 12, lineHeight: 1.6, color: '#a89878' }}>
                    This is not a subscription. It's a way to help build something lasting.
                    Thank you for believing in it early.
                </p>
            </div>
        </div>,
        document.body
    )
}
