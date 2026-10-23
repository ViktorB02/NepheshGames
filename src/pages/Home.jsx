import { useState } from 'react'
import { useProgress } from '@react-three/drei'
import { MAPS } from '../data/hotspots'
import Scene from '../components/Scene'
import LoadingScreen from '../components/LoadingScreen'
import { Counter, InfoPanel } from '../components/InfoPanel'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import RegionNav from '../components/RegionNav'
import MobileNavBar from '../components/MobileNavBar'
import MobileStatus from '../components/MobileStatus'
import StoryPanel from '../components/StoryPanel'
import HistoryPanel from '../components/HistoryPanel'
import GameLoopPanel from '../components/GameLoopPanel'
import WelcomePanel from '../components/WelcomePanel'
import useIsMobile from '../hooks/useIsMobile'

export default function Home() {
    const [regionId, setRegionId] = useState(1)
    const [active, setActive] = useState(null)
    const [discovered, setDiscovered] = useState([])
    const [storyOpen, setStoryOpen] = useState(false)
    const [storyStep, setStoryStep] = useState(0)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [gameLoopOpen, setGameLoopOpen] = useState(false)
    const isMobile = useIsMobile()
    const [welcomeOpen, setWelcomeOpen] = useState(() => !isMobile)   // phones start on the map, not a sheet
    const { active: loading } = useProgress()

    const region = MAPS.find((m) => m.id === regionId)

    const handleHotspotClick = (id) => {
        setStoryOpen(false)   // history, story, game loop and hotspot panels share the left side
        setHistoryOpen(false)
        setGameLoopOpen(false)
        setWelcomeOpen(false)
        setActive(id)
        if (!discovered.includes(id)) setDiscovered([...discovered, id])
    }

    const handleRegionSelect = (id) => {
        setRegionId(id)
        setActive(null)       // затвори панел
        setDiscovered([])     // ресетирај discovered за новиот регион
        setStoryOpen(false)
        setStoryStep(0)
        setHistoryOpen(false)
        setGameLoopOpen(false)
        setWelcomeOpen(true)  // every map switch re-opens that map's Welcome (it appears once the map has loaded)
    }

    const handleOpenStory = () => {
        setActive(null)
        setHistoryOpen(false)
        setGameLoopOpen(false)
        setWelcomeOpen(false)
        setStoryStep(0)
        setStoryOpen(true)
    }

    const handleOpenHistory = () => {
        setActive(null)
        setStoryOpen(false)
        setGameLoopOpen(false)
        setWelcomeOpen(false)
        setHistoryOpen(true)
    }

    const handleOpenGameLoop = () => {
        setActive(null)
        setStoryOpen(false)
        setHistoryOpen(false)
        setWelcomeOpen(false)
        setGameLoopOpen(true)
    }

    const handleOpenWelcome = () => {
        setActive(null)
        setStoryOpen(false)
        setHistoryOpen(false)
        setGameLoopOpen(false)
        setWelcomeOpen(true)
    }

    const activeData = region.hotspots.find((h) => h.id === active)

    return (
        <div style={{ width: '100%', height: '100dvh', position: 'relative', overflowX: 'hidden' }}>
            {loading && <LoadingScreen />}

            <Scene
                key={regionId}
                region={region}
                active={active}
                discovered={discovered}
                onHotspotClick={handleHotspotClick}
            />

            <Sidebar onOpenHistory={handleOpenHistory} onOpenGameLoop={handleOpenGameLoop} onOpenWelcome={handleOpenWelcome} />
            <TopBar />
            {/* phones get time + temperature from MobileStatus instead, so the bottom strip is desktop-only */}
            {!isMobile && (
                <BottomBar
                    onOpenStory={region.story?.length ? handleOpenStory : undefined}
                    hidden={!!activeData || historyOpen || gameLoopOpen || storyOpen || (welcomeOpen && !loading)}
                />
            )}
            {isMobile
                ? <MobileNavBar activeRegion={regionId} onSelect={handleRegionSelect} />
                : <RegionNav activeRegion={regionId} onSelect={handleRegionSelect} />}

            {isMobile && <MobileStatus regionId={regionId} />}
            <Counter discovered={discovered.length} total={region.hotspots.length} />
            <InfoPanel data={activeData} onClose={() => setActive(null)} />
            {historyOpen && <HistoryPanel onClose={() => setHistoryOpen(false)} />}
            {gameLoopOpen && <GameLoopPanel onClose={() => setGameLoopOpen(false)} />}
            {welcomeOpen && !loading && <WelcomePanel welcome={region.welcome} onClose={() => setWelcomeOpen(false)} />}
            {storyOpen && region.story?.length > 0 && (
                <StoryPanel
                    story={region.story}
                    step={storyStep}
                    onStep={setStoryStep}
                    onClose={() => setStoryOpen(false)}
                />
            )}
        </div>
    )
}