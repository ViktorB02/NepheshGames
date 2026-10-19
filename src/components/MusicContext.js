import { createContext, useContext } from 'react'

// Shared state of the site-wide background music: { muted, toggle }. Provided by MusicProvider (MusicPlayer.jsx).
export const MusicContext = createContext({ muted: false, toggle: () => {} })

export const useMusic = () => useContext(MusicContext)
