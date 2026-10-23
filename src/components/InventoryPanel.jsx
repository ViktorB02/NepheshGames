import DevLogsPanel from './DevLogsPanel'
import { WEAPONS } from '../data/weapons'

// Inventory / Special Weapons postcard modal (backpack buttons). Same card, overlay and navigation as DevLogsPanel, fed with the weapons pages.
export default function InventoryPanel({ open, onClose }) {
    return <DevLogsPanel open={open} onClose={onClose} pages={WEAPONS} label="Inventory" />
}
