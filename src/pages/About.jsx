import { Link } from 'react-router-dom'

const GOLD = '#c9922a'
const GOLD_LIGHT = '#e8b84b'
const CARD_BG = '#241515'
const CARD_BORDER = '1px solid rgba(201,146,42,0.2)'

const SPECS = [
    ['Genre', 'Sandbox MMO RPG, PvP kingdom warfare'],
    ['Setting', 'Elzorn, Humans vs Orcs'],
    ['Client', 'Unity 6.5, URP, C#'],
    ['Server', 'Node.js, TypeScript, WebSocket, PostgreSQL, Redis'],
    ['Platform', 'PC, free-to-play on Steam'],
    ['Look', 'Dark fantasy, stylized-realistic'],
]

const LOOP = ['Hunt', 'Gather', 'Upgrade', 'Level Up', 'Go to War']

const BUILT = [
    {
        title: 'Character & Combat',
        items: [
            ['Leveling 1 to 100', true],
            ['Three weapon types: sword, bow, staff', true],
            ['Abilities with mana and cooldowns', true],
            ['Mobs and bosses with chest loot', true],
            ['WASD and click-to-move', true],
        ],
    },
    {
        title: 'Items & Economy',
        items: [
            ['Inventory, 8-slot equipment, five rarity tiers', true],
            ['Item durability and blacksmith repair', true],
            ['NPC shops, material sellers, gold economy', true],
            ['Mining and woodcutting with skill levels', true],
            ['Job NPCs to pick a profession', true],
        ],
    },
    {
        title: 'World',
        items: [
            ['1×1 km handcrafted island with a city', true],
            ['Mounts: horse and griffin', true],
            ['Minimap and full world map', true],
        ],
    },
    {
        title: 'Multiplayer',
        items: [
            ['Player movement and animation sync', true],
            ['Server-authoritative combat and shared mobs', false],
            ['Chat between players — UI done, networking next', false],
        ],
    },
]

const NEXT_UP = [
    'Fully networked world: shared mobs, real chat, trading between players',
    'Territory war between Humans and Orcs',
    'Art pass across the whole game — which is where you come in',
    'Free-to-play release on Steam',
]

const TEAM = [
    {
        name: 'Viktor Božinovski',
        role: 'Co-founder, game design, Unity client',
        bio: 'Started Lords of Elzorn and builds the game in Unity: combat, items, economy, gathering, UI logic and the world. Computer science student in Skopje, North Macedonia. Previously shipped Pix Empire, a real-time multiplayer pixel canvas game.',
        tags: ['Unity', 'C#', 'Node.js', 'Blender'],
    },
    {
        name: 'Stefan Velkov',
        role: 'Co-founder, server & networking',
        bio: 'Builds the game server: multiplayer sync, networked mobs and server-authoritative combat, so the world is shared and fair for every player.',
        tags: ['Node.js', 'TypeScript', 'WebSocket', 'PostgreSQL', 'Redis'],
    },
]

export default function About() {
    return (
        <div style={{
            minHeight: '100vh', background: '#1a0e0e', color: '#e2ddd0',
            fontFamily: "'Inter', sans-serif",
        }}>
            <style>{`
                .about-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .about-loop { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; }
                @media (max-width: 768px) {
                    .about-grid-2 { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* назад копче */}
            <Link to="/" style={{
                position: 'fixed', top: 24, left: 24, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#8a8478', textDecoration: 'none', fontSize: 13,
                letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
                ← Back to World
            </Link>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '120px 32px 80px' }}>
                {/* HERO + 1. INTRO */}
                <div style={{ textAlign: 'center', marginBottom: 80 }}>
                    <svg viewBox="0 0 100 100" fill="none" style={{ width: 70, height: 70, marginBottom: 24 }}>
                        <circle cx="50" cy="50" r="40" stroke={GOLD} strokeWidth="1.5" />
                        <path d="M50,18 C62,32 70,47 70,59 C70,70 61,79 50,79 C39,79 30,70 30,59 C30,47 38,32 50,18 Z" fill={GOLD} />
                    </svg>
                    <h1 style={{
                        fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                        fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12,
                        background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Lords of Elzorn
                    </h1>
                    <p style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7a7468', marginBottom: 40 }}>
                        A Nephesh Game Studio Project
                    </p>
                    <div style={{ maxWidth: 680, margin: '0 auto', fontSize: 16, lineHeight: 1.9, color: '#b5b0a4', fontWeight: 300 }}>
                        <p style={{ marginBottom: 16 }}>
                            <strong style={strong}>Nephesh Game Studio</strong> is an independent studio focused on <strong style={strong}>real-time multiplayer experiences</strong> built on a serious technical foundation. We care about worlds that feel alive, not just functional.
                        </p>
                        <p>
                            We've already shipped <strong style={strong}>Pix Empire</strong>, a real-time multiplayer pixel canvas game. <strong style={strong}>Lords of Elzorn</strong> is our new project, and our most ambitious yet.
                        </p>
                    </div>
                </div>

                {/* 2. ABOUT THE GAME */}
                <Section label="The Game" title="About Lords of Elzorn">
                    <div className="about-grid-2" style={{ alignItems: 'start' }}>
                        <div style={bodyText}>
                            <p style={{ marginBottom: 16 }}>
                                Lords of Elzorn is a sandbox fantasy MMO set in the world of <strong style={strong}>Elzorn</strong>, where <strong style={strong}>Humans and Orcs</strong> fight for territory.
                            </p>
                            <p>
                                Everything you hunt, gather and craft feeds the war between the two kingdoms.
                            </p>
                        </div>
                        <div style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 10, overflow: 'hidden' }}>
                            {SPECS.map(([k, v], i) => (
                                <div key={k} style={{
                                    display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16,
                                    padding: '14px 20px', fontSize: 14, lineHeight: 1.5,
                                    borderTop: i === 0 ? 'none' : '1px solid rgba(201,146,42,0.12)',
                                }}>
                                    <span style={{ color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12, paddingTop: 2 }}>{k}</span>
                                    <span style={{ color: '#e2ddd0' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* 3. THE CORE LOOP */}
                <Section label="The Core Loop" title="Hunt. Gather. Upgrade. Repeat.">
                    <div className="about-loop">
                        {LOOP.map((step, i) => (
                            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 84 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        border: `1.5px solid ${GOLD}`, background: 'rgba(201,146,42,0.12)',
                                        color: GOLD_LIGHT, fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{i + 1}</div>
                                    <span style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e2ddd0' }}>{step}</span>
                                </div>
                                {i < LOOP.length - 1 && <span style={{ color: GOLD, fontSize: 18, marginBottom: 26 }}>→</span>}
                            </div>
                        ))}
                        <svg title="Repeat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 26, marginLeft: 4 }}>
                            <path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15" />
                            <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" />
                        </svg>
                    </div>
                </Section>

                {/* 4. WHAT'S ALREADY BUILT */}
                <Section label="What's Already Built" title="This is a working game, not a pitch.">
                    <div style={{ display: 'flex', gap: 24, marginBottom: 24, fontSize: 13, color: '#8a8478' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot on /> Playable</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot /> In progress</span>
                    </div>
                    <div className="about-grid-2">
                        {BUILT.map((group) => (
                            <div key={group.title} style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 10, padding: 28 }}>
                                <div style={{
                                    fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, color: GOLD,
                                    letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18,
                                }}>{group.title}</div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {group.items.map(([text, playable]) => (
                                        <li key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, color: playable ? '#e2ddd0' : '#a39d90' }}>
                                            <span style={{ paddingTop: 5 }}><Dot on={playable} /></span>
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 5. NEXT UP */}
                <Section label="Next Up" title="The plan from here">
                    <p style={{ ...bodyText, marginBottom: 24 }}>The plan from here, roughly in this order. No dates, just direction.</p>
                    <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {NEXT_UP.map((text, i) => (
                            <li key={text} style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 15, color: '#e2ddd0' }}>
                                <span style={{
                                    flex: '0 0 32px', height: 32, borderRadius: '50%',
                                    border: `1px solid ${GOLD}`, color: GOLD_LIGHT,
                                    fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>{i + 1}</span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ol>
                </Section>

                {/* 6. CORE TEAM */}
                <Section label="Core Team" title="Behind the project">
                    <div className="about-grid-2">
                        {TEAM.map((m) => (
                            <div key={m.name} style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 10, padding: 28 }}>
                                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600, color: '#e2ddd0', marginBottom: 6 }}>{m.name}</div>
                                <div style={{ fontSize: 13, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{m.role}</div>
                                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#b5b0a4', fontWeight: 300, marginBottom: 18 }}>{m.bio}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {m.tags.map((t) => (
                                        <span key={t} style={{
                                            fontSize: 12, padding: '4px 12px', borderRadius: 100,
                                            border: '1px solid rgba(201,146,42,0.35)', color: GOLD_LIGHT,
                                        }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* footer */}
                <div style={{ textAlign: 'center', marginTop: 80, color: '#7a7468', fontSize: 13 }}>
                    Crafting multiplayer worlds — Skopje, North Macedonia
                </div>
            </div>
        </div>
    )
}

const strong = { color: '#e2ddd0', fontWeight: 500 }
const bodyText = { fontSize: 16, lineHeight: 1.9, color: '#b5b0a4', fontWeight: 300 }

function Dot({ on = false }) {
    return (
        <span style={{
            display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
            background: on ? '#6fcf6f' : 'rgba(226,221,208,0.18)',
            boxShadow: on ? '0 0 6px rgba(111,207,111,0.5)' : 'none',
        }} />
    )
}

function Section({ label, title, children }) {
    return (
        <div style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontFamily: "'Cinzel', serif" }}>{label}</p>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 20 }}>{title}</h2>
            <div style={{ width: 50, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: 28 }} />
            {children}
        </div>
    )
}
