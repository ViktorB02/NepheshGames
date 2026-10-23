import HelpButton from './HelpButton'
import { DESKTOP_BOTTOM_CLEARANCE } from '../layout'

const TIPS = [
    'Click and drag to rotate the view',
    'Scroll to zoom',
    'Click the glowing circles to discover points of interest',
    'Use the 1 / 2 / 3 buttons to travel between regions',
]

// Desktop "?" button, rendered inside the Counter's top-right row (36px, same as the mute button).
export default function DesktopHelp() {
    return <HelpButton tips={TIPS} size={36} clearance={DESKTOP_BOTTOM_CLEARANCE} />
}
