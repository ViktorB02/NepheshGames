import { MAPS } from '../data/hotspots'

import useIsMobile from '../hooks/useIsMobile'
import { MOBILE_NAV_TOP } from '../layout'

export default function RegionNav({ activeRegion, onSelect }) {
    const isMobile = useIsMobile()
    return (
        <div style={{
            position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)',
            zIndex: 40, display: 'flex', flexDirection: 'column', gap: 14,
            ...(isMobile && {
                top: MOBILE_NAV_TOP, right: 'auto', left: '50%', transform: 'translateX(-50%)',
                flexDirection: 'row', gap: 10,
            }),
        }}>
            {/* hover only on real hover devices, so it never sticks after a tap */}
            <style>{`
                .region-btn { color: #8a8478; }
                .region-btn.active { color: #fff; }
                @media (hover: hover) { .region-btn:not(.active):hover { color: #e8b84b; } }
            `}</style>
            {MAPS.map((m) => {
                const isActive = m.id === activeRegion
                return (
                    <div
                        key={m.id}
                        className={isActive ? 'region-btn active' : 'region-btn'}
                        onClick={() => onSelect(m.id)}
                        title={m.name}
                        style={{
                            width: 44, height: 44, borderRadius: '50%',
                            background: isActive ? 'rgba(201,146,42,0.9)' : 'rgba(8,11,22,0.9)',
                            border: `1px solid ${isActive ? '#e8b84b' : 'rgba(201,146,42,0.3)'}`,
                            fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none',
                            ...(isMobile && { width: 40, height: 40, fontSize: 15 }),
                        }}
                    >
                        {m.id}
                    </div>
                )
            })}
        </div>
    )
}
