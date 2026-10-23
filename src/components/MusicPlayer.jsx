import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useProgress } from '@react-three/drei'
import { MusicContext } from './MusicContext'
import MusicButton from './MusicButton'

const SRC = `${import.meta.env.BASE_URL}ExplorationMusic.mp3`
const VOLUME = 0.35                      // low ambient level
const STORAGE_KEY = 'elzorn-music-muted' // '1' = the user muted it

const readMuted = () => {
    try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}
const saveMuted = (muted) => {
    try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0') } catch { /* storage unavailable */ }
}

// Looping background music for the whole site. Mounted once at the app root (inside the router, wrapping the routes),
// so it keeps playing, without restarting, across route and map changes. The toggle button lives next to the
// "Discovered" counter on the home screen (<MusicButton />); on every other page a floating copy is shown instead.
// Start-up: try to autoplay (unmuted, then muted if the browser refuses). Browsers that block both start it on the
// first click / tap / key press instead.
export default function MusicProvider({ children }) {
    const audioRef = useRef(null)
    const [muted, setMuted] = useState(readMuted)
    const mutedRef = useRef(muted)
    const { pathname } = useLocation()

    useEffect(() => {
        const audio = new Audio(SRC)
        audio.loop = true
        audio.volume = VOLUME
        audio.preload = 'none'   // the ~7MB mp3 must not compete with the map GLB; it starts once loading is done (see below)
        audioRef.current = audio

        const events = ['pointerdown', 'keydown', 'touchend']
        const removeGesture = () => events.forEach((e) => window.removeEventListener(e, onGesture))
        // First interaction: unmute (unless the user muted it) and make sure it is playing.
        function onGesture() {
            if (mutedRef.current) return removeGesture()
            audio.muted = false
            audio.play().then(removeGesture).catch(() => { /* still blocked: keep waiting for the next gesture */ })
        }
        events.forEach((e) => window.addEventListener(e, onGesture))

        return () => {
            removeGesture()
            audio.pause()
            audioRef.current = null
        }
    }, [])

    // Autoplay attempt, deferred until the 3D loading screen has cleared (progress 100 and nothing loading), on any
    // non-map page right away, or after a 20s fallback. A click / tap / key press before that still starts it.
    const { active: loadingActive, progress } = useProgress()
    const [fallback, setFallback] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setFallback(true), 20000)
        return () => clearTimeout(t)
    }, [])
    const ready = pathname !== '/' || fallback || (progress >= 100 && !loadingActive)
    useEffect(() => {
        const audio = audioRef.current
        if (!ready || !audio || mutedRef.current || !audio.paused) return
        audio.play().catch(() => {
            // unmuted autoplay blocked -> muted autoplay is usually allowed; the gesture handler unmutes it
            audio.muted = true
            audio.play().catch(() => { /* wait for the first interaction */ })
        })
    }, [ready])

    const value = useMemo(() => ({
        muted,
        toggle: () => {
            const audio = audioRef.current
            const next = !mutedRef.current
            mutedRef.current = next
            setMuted(next)
            saveMuted(next)
            if (!audio) return
            audio.muted = next
            if (!next) audio.play().catch(() => { /* ignore */ })
        },
    }), [muted])

    return (
        <MusicContext.Provider value={value}>
            {children}
            {pathname !== '/' && <MusicButton size={40} floating />}
        </MusicContext.Provider>
    )
}
