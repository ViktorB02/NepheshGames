import HelpButton from './HelpButton'

const TIPS = [
    'Drag to rotate the view',
    'Pinch to zoom',
    'Tap the glowing circles to discover points of interest',
    'Use PREV / NEXT to travel between regions',
]

// Phone "?" button, rendered inside the Counter's top-right row (30px, same as the mute button).
export default function MobileHelp() {
    return <HelpButton tips={TIPS} size={30} />
}
