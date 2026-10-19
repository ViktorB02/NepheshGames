import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Apply from './pages/Apply'
import ApplyForm from './pages/ApplyForm'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
    return (
        <BrowserRouter>
            <MusicPlayer>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/apply/:position" element={<ApplyForm />} />
                </Routes>
            </MusicPlayer>
        </BrowserRouter>
    )
}