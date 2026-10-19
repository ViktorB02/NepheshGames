import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { LIFT } from '../data/hotspots'
import Hotspot from './Hotspot'
import MapParticles from './Particles'
import useIsMobile from '../hooks/useIsMobile'

// useGLTF returns one cached scene shared across mounts, so render a per-mount
// clone (SkeletonUtils keeps skinned meshes bound to the clone's own bones).
// `offset` is the fixed translation that centers the model in hotspot space.
function City({ model, offset = [0, 0, 0] }) {
    const { scene, animations } = useGLTF(model)
    const clone = useMemo(() => cloneSkinned(scene), [scene])
    // Bind the mixer to the rendered clone (not the cached original) so clips drive the visible bones.
    // Models without clips (map 1) get an empty actions object and the effect is a no-op.
    const { actions, names } = useAnimations(animations, clone)
    useEffect(() => {
        names.forEach((n) => actions[n]?.reset().setLoop(THREE.LoopRepeat, Infinity).play())
        return () => names.forEach((n) => actions[n]?.stop())
    }, [actions, names])
    return (
        <group position={offset}>
            <primitive object={clone} />
        </group>
    )
}

const FOCUS_DIST = 75 // default focus distance; override per map with `focusDist` in hotspots.js

const MOBILE_FOCUS_MULT = 2.0 // phones stay 2x further out on hotspot focus than desktop
const MOBILE_FOCUS_MAX = 0.7 // ...capped at this fraction of the map's camMobile distance

function CameraRig({ region, cam, active, controlsRef, isMobile }) {
    const { camera, gl } = useThree()
    const target = useRef(new THREE.Vector3(...cam.target))
    const camPos = useRef(new THREE.Vector3(...cam.pos))
    const flying = useRef(false)

    useEffect(() => {
        const el = gl.domElement
        const stop = () => { flying.current = false }
        el.addEventListener('wheel', stop, { passive: true })
        el.addEventListener('pointerdown', stop)
        return () => {
            el.removeEventListener('wheel', stop)
            el.removeEventListener('pointerdown', stop)
        }
    }, [gl])

    useEffect(() => {
        if (active == null) {
            camPos.current.set(...cam.pos)
            target.current.set(...cam.target)
            flying.current = true
            return
        }
        const h = region.hotspots.find((x) => x.id === active)
        if (!h) return
        const look = new THREE.Vector3(h.pos[0], h.pos[1] + LIFT * 0.4, h.pos[2])
        // Approach along the map's own view axis (target -> pos) so focus never swings to the far side.
        const offset = new THREE.Vector3(...cam.pos).sub(new THREE.Vector3(...cam.target))
        let dist = region.focusDist ?? FOCUS_DIST
        // On phones stay further out, but never beyond MOBILE_FOCUS_MAX of the map's own view distance, so a tap always zooms IN.
        if (isMobile) dist = Math.min(dist * MOBILE_FOCUS_MULT, offset.length() * MOBILE_FOCUS_MAX)
        offset.setLength(dist)
        camPos.current.copy(look).add(offset)
        target.current.copy(look)
        flying.current = true
    }, [active, region, cam, isMobile])

    useFrame(() => {
        if (!flying.current) return
        const controls = controlsRef.current
        camera.position.lerp(camPos.current, 0.06)
        if (controls) {
            controls.target.lerp(target.current, 0.06)
            controls.update()
        }
        if (camera.position.distanceTo(camPos.current) < 2) {
            flying.current = false
        }
    })

    return null
}

export default function Scene({ region, active, discovered, onHotspotClick }) {
    const controlsRef = useRef()
    const isMobile = useIsMobile()
    const cam = isMobile && region.camMobile ? region.camMobile : region.cam

    // Sawmill (map 2) is viewed from close up, so fill-rate matters more: cheaper depth buffer, lower dpr, and no
    // shadow pass (no mesh casts or receives shadows). Map 1 keeps its original settings exactly.
    // Home mounts <Scene key={regionId}>, so the Canvas is recreated on map switch and gl options apply per map.
    const sawmill = region.id === 2

    return (
        <Canvas
            shadows={!sawmill}
            camera={{ position: cam.pos, fov: 45, near: 10, far: 2000 }}
            dpr={sawmill ? [1, 1.25] : [1, 1.5]}
            gl={{ powerPreference: 'high-performance', antialias: true, logarithmicDepthBuffer: !sawmill }}
        >
            <color attach="background" args={['#e8dcc4']} />
            <ambientLight intensity={0.8} color="#fff3e0" />
            <hemisphereLight args={['#cfe8ff', '#e8d4a0', 0.7]} />
            <directionalLight
                position={[30, 50, 20]} intensity={2.2} color="#ffdca8"
                castShadow={!sawmill} shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-80} shadow-camera-right={80}
                shadow-camera-top={80} shadow-camera-bottom={-80} shadow-camera-far={200}
            />

            <Suspense fallback={null}>
                <City model={region.model} offset={region.offset} />
                <Environment preset="sunset" environmentIntensity={0.6} />
                <MapParticles regionId={region.id} />

                {region.hotspots.map((h) => (
                    <Hotspot
                        key={h.id}
                        data={h}
                        active={active === h.id}
                        discovered={discovered.includes(h.id)}
                        onClick={onHotspotClick}
                    />
                ))}
            </Suspense>

            <CameraRig region={region} cam={cam} active={active} controlsRef={controlsRef} isMobile={isMobile} />
            <OrbitControls ref={controlsRef} makeDefault target={cam.target} enableRotate enablePan enableZoom />
        </Canvas>
    )
}