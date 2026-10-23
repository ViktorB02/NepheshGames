import { Link } from 'react-router-dom'

const POSITIONS = [
    { slug: '3d-modeling', title: '3D Modeling Artist', desc: 'Create and optimize 3D models, environments and props for a stylized medieval world. Experience with low-poly / stylized assets and real-time game pipelines preferred.' },
    { slug: 'ui-ux', title: 'UI/UX Artist', desc: 'Design clean, readable interfaces for an MMO RPG: menus, HUD, inventory, and social systems. A strong sense of game UX and visual hierarchy is key.' },
    { slug: 'vfx', title: 'VFX Artist', desc: 'Bring the world to life with particle effects, spells, combat impacts and environmental effects. Experience with real-time VFX in Unity is a plus.' },
]

export default function Apply() {
    return (
        <div style={{
            minHeight: '100vh', background: '#d0c0a0', color: '#2a1818',
            fontFamily: "'Inter', sans-serif",
        }}>
            <Link to="/" style={{
                position: 'fixed', top: 24, left: 24, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#5a4a3c', textDecoration: 'none', fontSize: 13,
                letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
                ← Back to World
            </Link>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a5a0c', marginBottom: 14, fontFamily: "'Cinzel', serif" }}>Join the team</p>
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
                        Open Positions
                    </h1>
                    <p style={{ fontSize: 16, color: '#5a4a3c', fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                        We're a small team building something ambitious. If you want to help shape a living world, we'd love to hear from you.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {POSITIONS.map((p) => (
                        <div key={p.slug} style={{
                            background: 'rgba(42,24,24,0.06)', border: '1px solid rgba(201,146,42,0.6)',
                            borderRadius: 10, padding: 32,
                            display: 'flex', flexDirection: 'column', gap: 16,
                        }}>
                            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 600, letterSpacing: '0.05em' }}>{p.title}</h3>
                            <p style={{ fontSize: 15, color: '#3d2c2a', lineHeight: 1.8, fontWeight: 300 }}>{p.desc}</p>
                            <Link to={`/apply/${p.slug}`} style={{
                                alignSelf: 'flex-start', marginTop: 8,
                                padding: '10px 28px', borderRadius: 100,
                                background: 'rgba(201,146,42,0.3)', border: '1px solid #c9922a',
                                color: '#2a1818', textDecoration: 'none',
                                fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
                            }}>
                                Apply →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}