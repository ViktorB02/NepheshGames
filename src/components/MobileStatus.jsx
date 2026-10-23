import { useState, useEffect } from 'react'
import { MOBILE_STATUS_TOP } from '../layout'

const formatTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

// Map 3 (the Temple) is hot: its temperature drifts between these values.
const HOT_MAP = 3
const HOT_MIN = 37
const HOT_MAX = 39
const HOT_TICK_MS = 4000
const CALM_TEMP = 18 // maps 1 and 2

// Phone-only top-left status: local time + temperature for the active map. Rendered by Home only when useIsMobile() is true.
export default function MobileStatus({ regionId }) {
    const [time, setTime] = useState(formatTime)
    const [hotTemp, setHotTemp] = useState(38)

    // Local time, refreshed on every minute boundary.
    useEffect(() => {
        let t
        const tick = () => {
            setTime(formatTime())
            t = setTimeout(tick, 60000 - (Date.now() % 60000) + 50)
        }
        tick()
        return () => clearTimeout(t)
    }, [])

    // Temple temperature: nudge by one degree every few seconds, staying within 37-39.
    useEffect(() => {
        if (regionId !== HOT_MAP) return
        const t = setInterval(() => {
            setHotTemp((v) => {
                const step = Math.random() < 0.5 ? -1 : 1
                const next = v + step
                return next < HOT_MIN || next > HOT_MAX ? v - step : next
            })
        }, HOT_TICK_MS)
        return () => clearInterval(t)
    }, [regionId])

    const temp = regionId === HOT_MAP ? hotTemp : CALM_TEMP

    const pill = {
        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px 5px 9px', borderRadius: 100,
        background: '#e8dcc4', border: '1.5px solid #2a1818', color: '#2a1818',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(201,146,42,0.5)',
        fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }
    const svgProps = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: '#c9922a', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

    return (
        <div style={{
            position: 'absolute', top: MOBILE_STATUS_TOP, left: 12, zIndex: 40,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, pointerEvents: 'none',
        }}>
            <div style={pill}>
                <svg {...svgProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                <span>{time}</span>
            </div>
            <div style={pill}>
                <svg {...svgProps}><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" /><path d="M12 9v7" /></svg>
                <span>{temp}°C</span>
            </div>
        </div>
    )
}
