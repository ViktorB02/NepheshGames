import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { LIFT } from '../data/hotspots'
import useIsMobile from '../hooks/useIsMobile'

const MARKER_PX = 40   // on-screen diameter, independent of zoom/distance
const TEX_PX = 512     // texture resolution (kept crisp on hi-dpi screens)
const PAD = 2          // transparent margin so the anti-aliased edge isn't clipped

// Draws the numbered circle marker onto a canvas texture.
function makeMarkerTexture(id, active, discovered, anisotropy) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = TEX_PX
    const ctx = canvas.getContext('2d')
    const k = TEX_PX / MARKER_PX
    const border = 2 * k
    const r = TEX_PX / 2 - PAD - border / 2

    ctx.beginPath()
    ctx.arc(TEX_PX / 2, TEX_PX / 2, r, 0, Math.PI * 2)
    ctx.fillStyle = active ? '#3d6aa3' : '#2C4A6E'
    ctx.fill()
    ctx.lineWidth = border
    ctx.strokeStyle = discovered ? '#8fd18f' : '#fff'
    ctx.stroke()

    ctx.fillStyle = '#fff'
    ctx.font = `400 ${22 * k}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(id), TEX_PX / 2, TEX_PX / 2 + k * 0.8)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = anisotropy
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearMipmapLinearFilter // mipmaps keep the 512px art clean when drawn at ~40-60px
    return tex
}

// The marker is a WebGL sprite (no DOM / extra React root), so it can't be lost
// when the Canvas unmounts and remounts on route changes.
export default function Hotspot({ data, active, discovered, onClick }) {
    const ground = data.pos
    const isMobile = useIsMobile()
    // optional per-hotspot `lift`; `liftMobile` overrides it on phones only
    const lift = (isMobile ? data.liftMobile : undefined) ?? data.lift ?? LIFT
    const top = [ground[0], ground[1] + lift, ground[2]]
    const spriteRef = useRef()
    const { size, camera, gl } = useThree()

    const texture = useMemo(
        () => makeMarkerTexture(data.id, active, discovered, gl.capabilities.getMaxAnisotropy()),
        [data.id, active, discovered, gl]
    )
    useEffect(() => () => texture.dispose(), [texture])

    // Snap the sprite centre to a whole device pixel just before each render (after
    // the camera has moved for this frame), so the texture is never sampled on
    // fractional pixels, which is what makes it look soft.
    useLayoutEffect(() => {
        const sprite = spriteRef.current
        const v = new THREE.Vector3()
        sprite.position.set(...top)
        sprite.onBeforeRender = (renderer, scene, cam) => {
            const w = renderer.domElement.width
            const h = renderer.domElement.height
            v.set(top[0], top[1], top[2]).project(cam)
            v.x = (Math.round((v.x * 0.5 + 0.5) * w) / w) * 2 - 1
            v.y = (Math.round((v.y * 0.5 + 0.5) * h) / h) * 2 - 1
            v.unproject(cam)
            sprite.position.copy(v)
            sprite.updateMatrixWorld()
        }
        return () => { sprite.onBeforeRender = () => {} }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ground[0], ground[1], ground[2], lift])

    // Sprite with sizeAttenuation=false: scale 1 spans (projection[1][1] / 2) of the
    // viewport height, so solve for a constant pixel size.
    useFrame(() => {
        const s = (MARKER_PX * 2) / (size.height * camera.projectionMatrix.elements[5]) * (TEX_PX / (TEX_PX - 2 * PAD))
        const k = active ? 1.2 : 1
        spriteRef.current?.scale.set(s * k, s * k, 1)
    })

    return (
        <group>
            <Line points={[top, ground]} color="#2C4A6E" lineWidth={1.5} />
            <sprite
                ref={spriteRef}
                renderOrder={10}
                onClick={(e) => { e.stopPropagation(); onClick(data.id) }}
                onPointerOver={() => { document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { document.body.style.cursor = 'auto' }}
            >
                <spriteMaterial
                    map={texture}
                    sizeAttenuation={false}
                    depthTest={false}
                    transparent
                    toneMapped={false}
                />
            </sprite>
        </group>
    )
}
