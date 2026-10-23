// One-time check at module load: phones/tablets (iOS + Android) get the 128-texture models
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Секој регион = цела мапа со свои hotspots, камера, модел
export const MAPS = [
    {
        id: 1,
        name: 'Capital City',
        model: `${import.meta.env.BASE_URL}${isMobileDevice ? 'WebScene3_m128.glb' : 'WebScene3_512.glb'}`,
        offset: [529.98, -2.128, 225.555], // model translation in hotspot/camera space (model center lands near [154.8, 0, 63.5])
        cam: { pos: [92, 96.5, 268.9], target: [84.4, -46, 13.1] },
        camMobile: { pos: [155, 179, 532.7], target: [155, 0, 63] }, // phone portrait framing (1.4x back from target); nudge as needed
        focusDist: 75, // camera distance when a hotspot is opened
        story: [
            { speaker: 'Eldric the Chronicler', text: 'Sit, traveller, and listen. Long ago, all of Elzorn was one realm of four kingdoms, bound beneath a single High Crown. The Humans of the west, the Orcs of the east, and two others now lost to memory. For a hundred years they knew peace.' },
            { speaker: 'Sera the Historian', text: 'Then came the Sundering. The High Crown vanished. Stolen, some say, or simply lost. Without it, the old oaths meant nothing. Suspicion turned to greed, greed to malice, and malice to open war. The four kingdoms shattered, and Elzorn has bled ever since.' },
            { speaker: 'Captain Rowan', text: 'The Humans retreated west and raised Aldenmoor, the great fortress-city you see before you. Three rings of stone, a hundred towers, and a gate that has never fallen. From here, we hold the frontier against the Orc warbands pressing from the east.' },
            { speaker: 'Mira the Merchant', text: 'But a fortress is nothing without the people inside it. Our markets never close, and traders come from every corner of the realm. The forges burn day and night, arming the soldiers. The farmlands feed them. Aldenmoor is not just a wall; it is a living city, beating with its own heart.' },
            { speaker: 'Old Tomas', text: "I've seen three sieges from these ramparts, boy. The Orcs are not the only danger. The lost kingdoms stir again, and whispers speak of the High Crown returning. Dark days are coming for Elzorn." },
            { speaker: 'Warden Aldric', text: 'Aldenmoor still stands. Proud, defiant, unbroken. But the war for Elzorn is far from won. Every hand matters now. Will you stand with us, traveller?' },
        ],
        hotspots: [
            { id: 1, title: 'The Great Walls', text: 'These towering ramparts have protected Elzorn for generations, their stone towers standing watch over every approach to the city.', pos: [180.5, 10.1, 93.7] },
            { id: 2, title: 'The Realm of Elzorn', text: 'Welcome, traveller. Elzorn is a living medieval world where players build, trade, and battle for dominion over the land.', pos: [149.2, -1.5, 47.9], lift: 44 }, // lift = marker height above pos (default LIFT = 32); the leader line grows with it
            { id: 3, title: "The Citizens' Quarter", text: 'Here the people of Elzorn make their homes. Craftsmen, merchants and families who keep the city alive.', pos: [178.4, -1.5, 59.6], liftMobile: 60 }, // liftMobile = phone-only marker height (desktop uses the default LIFT)
            { id: 4, title: 'The Market Square', text: 'The beating heart of the city, where traders from distant lands gather to sell their wares beneath colourful awnings.', pos: [141.1, -1.4, 55.9] },
            { id: 5, title: 'The Farmlands', text: 'Beyond the square lie the fields that feed Elzorn: wheat, vegetables and crops tended from dawn to dusk.', pos: [128, 0, 62], liftMobile: 60 },
        ],
    },
    {
        id: 2,
        name: 'Sawmill',
        model: `${import.meta.env.BASE_URL}${isMobileDevice ? 'WebScene10_m128.glb' : 'WebScene10_web.glb'}`,
        offset: [532.465, -4.252, 234.86], // model translation in hotspot/camera space (same framing as map 1)
        cam: { pos: [183.1, 18.9, -43], target: [186.1, -4, 58.6] }, // previous: pos [179.3, 34.1, -32.1], target [183.2, -6.3, 58.2]. Older note: +43.6 X on pos and target slides the sawmill to screen-right; map 1 view rotated 180° about Y and pulled to 0.62x distance, aimed at the sawmill center
        camMobile: { pos: [156.3, 7.1, -122.6], target: [154.8, 0, 63.5] }, // phone portrait (viewed from -Z, same side as desktop)
        focusDist: 54, // smaller map: closer than map 1 on hotspot focus (was 40, too tight)
        hotspots: [
            { id: 1, title: 'The Woodcutters', text: "The lifeblood of Aldenmoor's economy. Here lumberjacks fell timber to fuel the kingdom's forges, walls, and war machines.", pos: [159.3, -6.1, 62.6], lift: 19 },
            { id: 2, title: 'The Timber Yard', text: 'Felled logs are gathered, stripped, and stacked — raw wood ready to be hauled to the Capital for building and crafting.', pos: [153.9, -6.5, 50.7], lift: 26 },
            { id: 3, title: 'The Workhorse', text: "Sturdy draft horses haul the day's timber across Elzorn, keeping the supply lines to the frontlines flowing.", pos: [137.7, -6.5, 47], lift: 26 },
        ],
    },
    {
        id: 3,
        name: 'The Temple of Elzorn',
        model: `${import.meta.env.BASE_URL}${isMobileDevice ? 'Temple1_m128.glb' : 'Temple1_web.glb'}`,
        offset: [159.9, 3.1, 63.2], // measured model translation in hotspot/camera space
        cam: { pos: [86.9, 4.9, 52.1], target: [177, -6.6, 35.5] },
        camMobile: { pos: [62.9, 10.3, 61], target: [154.8, 0, 63.5] }, // phone portrait
        focusDist: 54,
        hotspots: [
            { id: 1, title: 'The Eternal Temple', text: 'Older than any crown in Elzorn, the Eternal Temple stands beyond the quarrels of kings. Here Humans and Orcs alike lay down their arms — for on this sacred ground, no blade may be drawn. All who seek the favor of the old gods must come as pilgrims, not conquerors.', pos: [149.3, -4.9, 59.0], lift: 14 },
            { id: 2, title: "The Oracle's Altar", text: "At the heart of the temple burns the Oracle's flame, said to have never died since the First Age. Rulers from every kingdom send envoys to hear its prophecies — for whoever heeds the Oracle's word is said to shape the fate of all Elzorn.", pos: [161.1, -5.5, 71.3], lift: 20 },
        ],
    },
    // РЕГИОН 4+ (кога ќе го имаш): ист формат како горе; offset е optional (default [0, 0, 0]).
]

export const LIFT = 32