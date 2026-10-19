import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Ambient per-map particle layers. Each effect is ONE THREE.Points with a tiny custom shader (leaf / bird / soft-mote
// shape drawn per point), positions updated on the CPU in a single useFrame. Tweak everything in EFFECTS below.
// Bounds are in hotspot/camera world space (same space as hotspot `pos`): a box centred on `center`, `half` = half extents in X/Z,
// `yMin..yMax` = vertical range particles live in before respawning.
const EFFECTS = {
    // Map 2 (Sawmill): gentle falling autumn leaves
    leaves: {
        shape: 0,
        count: 90,
        colors: ['#6b8f3a', '#c9922a', '#8a5a2b'],
        size: [1.1, 1.9],        // world units (longest side of a leaf), random per leaf
        opacity: 0.95,
        speed: [3, 6],           // fall speed, world units / second
        sway: [2, 5],            // horizontal sway amplitude (units / second of drift)
        swayFreq: [0.6, 1.4],    // sway oscillations per ~second (radians/s)
        spin: [0.6, 2.0],        // rotation speed, radians / second
        center: [154.8, 63.5], half: [38, 30],
        yMin: -6, yMax: 40,
    },
    // Map 1 (Capital City): a loose flock of white birds circling the city. Not integrated: each bird's position is a
    // function of time on its own ellipse, so the flock never drifts apart.
    birds: {
        shape: 1,
        count: 12,
        colors: ['#ffffff', '#fffaf0', '#fff3de'],
        size: [8, 11],           // wingspan, world units
        opacity: 1,
        flap: [5, 8],            // wing-beat speed, radians / second (random per bird)
        orbit: {
            radius: [45, 115],   // ellipse X radius around `center`
            squash: [0.7, 1.0],  // Z radius = X radius * squash
            speed: [5, 9],       // flight speed along the orbit, world units / second
            height: [28, 58],    // base altitude (Y)
            bobAmp: [1, 3],      // vertical bobbing amplitude
            bobFreq: [0.4, 1.0], // vertical bobbing speed, radians / second
            reverse: 0.15,       // fraction of birds circling the other way
        },
        center: [154.8, 63.5],
    },
    // Map 1: a few tiny, faint motes blown slowly across the scene (subtle, so the birds stay the focus)
    wind: {
        shape: 2,
        count: 50,
        colors: ['#fff6e6', '#d8bd86'],
        size: [0.5, 1.1],
        opacity: 0.35,
        speed: [-0.2, 0.2],      // slight up/down wobble (units / second)
        drift: [6, 12],          // wind speed along +X, world units / second
        sway: [0.5, 1.5],
        swayFreq: [0.3, 0.9],
        spin: [0, 0],
        center: [154.8, 63.5], half: [110, 80],
        yMin: 2, yMax: 55,
    },
    // Map 3 (Temple): golden spirit / Oracle-flame energy rising from the temple heart, densest at the centre
    spirit: {
        shape: 3,
        count: 100,
        colors: ['#ffd87a', '#e8b84b', '#c9922a'],
        size: [0.5, 0.9],        // world units, the whole glow sprite (core is ~1/3 of it)
        opacity: 1,
        twinkle: [0.8, 2.2],     // pulse speed, radians / second (random per particle)
        twinkleMin: 0.3,         // lowest brightness of the pulse (0..1)
        speed: [-5, -2],         // negative = rises (units / second)
        sway: [1.5, 4],          // sideways drift while rising
        swayFreq: [0.3, 0.9],
        spin: [0, 0],
        focus: 2.2,              // >1 concentrates spawns toward the centre (1 = uniform over the ellipse)
        center: [154.8, 63.5], half: [32, 26],
        yMin: -6, yMax: 34,
    },
    // Map 3: very faint desert sand blown slowly across the scene
    sand: {
        shape: 2,
        count: 60,
        colors: ['#d8c49a', '#c9b07e'],
        size: [0.1, 0.2],
        opacity: 0.3,
        speed: [-0.15, 0.15],
        drift: [4, 9],           // breeze speed along +X, world units / second
        sway: [0.4, 1.2],
        swayFreq: [0.3, 0.8],
        spin: [0, 0],
        center: [154.8, 63.5], half: [55, 42],
        yMin: -6, yMax: 22,
    },
}

const VERT = /* glsl */ `
    attribute float aSize;
    attribute float aAngle;
    attribute vec3 aColor;
    attribute float aPhase;
    attribute float aTw;
    uniform float uPx;
    varying vec3 vColor;
    varying float vAngle;
    varying float vPhase;
    varying float vTw;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPx / max(-mv.z, 1.0);
        vColor = aColor;
        vAngle = aAngle;
        vPhase = aPhase;
        vTw = aTw;
        #include <logdepthbuf_vertex>
    }
`

const FRAG = /* glsl */ `
    uniform float uShape;
    uniform float uOpacity;
    uniform float uTime;
    uniform float uTwinkleMin;
    varying vec3 vColor;
    varying float vAngle;
    varying float vPhase;
    varying float vTw;
    #include <logdepthbuf_pars_fragment>
    void main() {
        #include <logdepthbuf_fragment>
        vec2 p = gl_PointCoord - 0.5;
        vec3 col = vColor;
        float a;
        if (uShape < 0.5) {
            // leaf: pointed ellipse with a darker midrib, rotated by vAngle
            float c = cos(vAngle), s = sin(vAngle);
            p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
            float u = p.x / 0.46;
            if (abs(u) > 1.0) discard;
            float w = 0.24 * pow(1.0 - u * u, 0.8);
            if (abs(p.y) > w) discard;
            a = 1.0 - smoothstep(w * 0.7, w, abs(p.y));
            col *= 1.0 - 0.28 * (1.0 - smoothstep(0.0, 0.025, abs(p.y)));
        } else if (uShape < 1.5) {
            // bird: gull-shaped wings (arched, tapering) whose tips beat up and down, plus a small body.
            // White core with a thin warm-grey edge so it still reads on the cream sky.
            vec2 q = vec2(p.x * 2.0, -p.y);           // q.x in -1..1 across the wingspan, q.y up
            float ax = abs(q.x);
            float flap = sin(uTime * vTw + vPhase);   // -1..1
            float yw = flap * 0.22 * ax + 0.07 * sin(ax * 3.14159);
            float t = 0.05 * (1.0 - 0.55 * ax);
            float d = abs(q.y - yw);
            float wing = ax <= 1.0 ? 1.0 : 0.0;
            float body = length(vec2(q.x / 0.14, q.y / 0.07));
            float core = max(wing * (1.0 - smoothstep(t * 0.6, t, d)), 1.0 - smoothstep(0.7, 0.9, body));
            float edge = max(wing * (1.0 - smoothstep(t, t + 0.035, d)), 1.0 - smoothstep(0.9, 1.35, body));
            col = mix(vec3(0.48, 0.40, 0.26), col, core);
            a = edge;
        } else if (uShape < 2.5) {
            // wind / sand mote: tiny soft dot
            a = 1.0 - smoothstep(0.05, 0.5, length(p));
            a *= a;
        } else {
            // spirit glow: bright core + soft halo (deeper tint in the halo so it reads on the cream background), twinkling
            float d = length(p) * 2.0;
            if (d > 1.0) discard;
            float pulse = uTwinkleMin + (1.0 - uTwinkleMin) * (0.5 + 0.5 * sin(uTime * vTw + vPhase));
            float core = 1.0 - smoothstep(0.0, 0.32, d);
            float halo = pow(1.0 - d, 2.6);
            col = mix(col * vec3(0.95, 0.68, 0.3), col, core);
            a = clamp(halo * 0.75 + core, 0.0, 1.0) * pulse;
        }
        if (a < 0.01) discard;
        gl_FragColor = vec4(col, a * uOpacity);
        #include <colorspace_fragment>
    }
`

const rand = (r) => r[0] + Math.random() * (r[1] - r[0])

// Picks an X/Z spawn point into out[o], out[o+2]: uniform over the box, or (cfg.focus) over the ellipse with
// the radius raised to the power `focus` so spawns pile up near the centre.
function spawnXZ(cfg, out, o) {
    const [cx, cz] = cfg.center
    if (cfg.focus) {
        const th = Math.random() * Math.PI * 2
        const r = Math.pow(Math.random(), cfg.focus)
        out[o] = cx + Math.cos(th) * cfg.half[0] * r
        out[o + 2] = cz + Math.sin(th) * cfg.half[1] * r
    } else {
        out[o] = cx + (Math.random() * 2 - 1) * cfg.half[0]
        out[o + 2] = cz + (Math.random() * 2 - 1) * cfg.half[1]
    }
}

// Builds the geometry/material and per-particle random parameters for one effect.
function createParticles(cfg) {
    const n = cfg.count
    const pos = new Float32Array(n * 3)
    const size = new Float32Array(n)
    const angle = new Float32Array(n)
    const color = new Float32Array(n * 3)
    const vel = new Float32Array(n)       // vertical speed (+ = falls)
    const swayAmp = new Float32Array(n)
    const swayF = new Float32Array(n)
    const phase = new Float32Array(n)
    const spin = new Float32Array(n)
    const drift = new Float32Array(n)     // wind speed along +X
    const flap = new Float32Array(n)      // wing-beat speed (birds)
    const tmp = new THREE.Color()
    // birds: per-bird orbit parameters
    const orbit = cfg.orbit && {
        rx: new Float32Array(n), rz: new Float32Array(n), omega: new Float32Array(n),
        theta: new Float32Array(n), baseY: new Float32Array(n), bobA: new Float32Array(n), bobF: new Float32Array(n),
    }
    for (let i = 0; i < n; i++) {
        if (!orbit) {
            spawnXZ(cfg, pos, i * 3)
            pos[i * 3 + 1] = cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin)
        }
        size[i] = rand(cfg.size)
        angle[i] = Math.random() * Math.PI * 2
        tmp.set(cfg.colors[i % cfg.colors.length])
        color.set([tmp.r, tmp.g, tmp.b], i * 3)
        vel[i] = cfg.speed ? rand(cfg.speed) : 0
        swayAmp[i] = cfg.sway ? rand(cfg.sway) : 0
        swayF[i] = cfg.swayFreq ? rand(cfg.swayFreq) : 0
        phase[i] = Math.random() * Math.PI * 2
        spin[i] = cfg.spin ? rand(cfg.spin) * (Math.random() < 0.5 ? -1 : 1) : 0
        drift[i] = cfg.drift ? rand(cfg.drift) : 0
        flap[i] = cfg.flap || cfg.twinkle ? rand(cfg.flap ?? cfg.twinkle) : 0   // wing-beat (birds) / pulse (spirit) speed
        if (orbit) {
            const o = cfg.orbit
            orbit.rx[i] = rand(o.radius)
            orbit.rz[i] = orbit.rx[i] * rand(o.squash)
            // angular speed = linear speed / radius, so every bird flies at a natural speed whatever its radius
            orbit.omega[i] = (rand(o.speed) / orbit.rx[i]) * (Math.random() < o.reverse ? -1 : 1)
            orbit.theta[i] = Math.random() * Math.PI * 2
            orbit.baseY[i] = rand(o.height)
            orbit.bobA[i] = rand(o.bobAmp)
            orbit.bobF[i] = rand(o.bobFreq)
        }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    geometry.setAttribute('aTw', new THREE.BufferAttribute(flap, 1))
    const material = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
        uniforms: {
            uPx: { value: 1 }, uTime: { value: 0 }, uShape: { value: cfg.shape }, uOpacity: { value: cfg.opacity },
            uTwinkleMin: { value: cfg.twinkleMin ?? 1 },
        },
    })
    return { geometry, material, pos, angle, vel, swayAmp, swayF, phase, spin, drift, orbit, n }
}

// Advances every particle by dt and refreshes the shader uniforms (one call per frame).
function stepParticles(state, cfg, t, dt, gl, camera) {
    const { pos, angle, vel, swayAmp, swayF, phase, spin, drift, orbit, n } = state
    const [cx, cz] = cfg.center
    if (orbit) {
        // birds: position is a pure function of time on each bird's own ellipse, with a gentle vertical bob
        for (let i = 0; i < n; i++) {
            const th = orbit.theta[i] + orbit.omega[i] * t
            const k = i * 3
            pos[k] = cx + Math.cos(th) * orbit.rx[i]
            pos[k + 1] = orbit.baseY[i] + Math.sin(t * orbit.bobF[i] + phase[i]) * orbit.bobA[i]
            pos[k + 2] = cz + Math.sin(th) * orbit.rz[i]
        }
    } else {
        for (let i = 0; i < n; i++) {
            const k = i * 3
            pos[k] += Math.sin(t * swayF[i] + phase[i]) * swayAmp[i] * dt
            pos[k + 2] += Math.cos(t * swayF[i] * 0.8 + phase[i]) * swayAmp[i] * 0.5 * dt
            pos[k + 1] -= vel[i] * dt
            if (cfg.drift) {
                pos[k] += drift[i] * dt
                // blown past the downwind edge -> re-enter from the upwind edge at a new height/depth
                if (pos[k] > cx + cfg.half[0]) {
                    spawnXZ(cfg, pos, k)
                    pos[k] = cx - cfg.half[0]
                    pos[k + 1] = cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin)
                }
            }
            angle[i] += spin[i] * dt
            // leave the volume vertically -> respawn at the opposite end; keep X/Z inside the box
            if (pos[k + 1] < cfg.yMin || pos[k + 1] > cfg.yMax) {
                spawnXZ(cfg, pos, k)
                pos[k + 1] = vel[i] > 0 ? cfg.yMax : cfg.yMin
            }
            pos[k] = Math.min(cx + cfg.half[0], Math.max(cx - cfg.half[0], pos[k]))
            pos[k + 2] = Math.min(cz + cfg.half[1], Math.max(cz - cfg.half[1], pos[k + 2]))
        }
    }
    state.geometry.attributes.position.needsUpdate = true
    state.geometry.attributes.aAngle.needsUpdate = true
    state.material.uniforms.uTime.value = t
    // pixels per world unit at depth 1: drawing-buffer height / (2 tan(fov/2))
    state.material.uniforms.uPx.value = gl.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))
}

function AmbientParticles({ effect }) {
    const cfg = EFFECTS[effect]
    const [state] = useState(() => createParticles(cfg))

    useEffect(() => () => { state.geometry.dispose(); state.material.dispose() }, [state])

    useFrame(({ gl, camera, clock }, delta) => {
        stepParticles(state, cfg, clock.elapsedTime, Math.min(delta, 0.05), gl, camera)
    })

    return <points geometry={state.geometry} material={state.material} frustumCulled={false} renderOrder={5} />
}

// Which effects belong to which map (each is its own single-geometry Points). 
const EFFECTS_BY_MAP = { 1: ['wind', 'birds'], 2: ['leaves'], 3: ['sand', 'spirit'] }

export default function MapParticles({ regionId }) {
    const list = EFFECTS_BY_MAP[regionId]
    return list ? list.map((effect) => <AmbientParticles key={effect} effect={effect} />) : null
}
