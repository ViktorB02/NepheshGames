import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COUNTRIES } from '../data/countries'

const TITLES = {
    '3d-modeling': '3D Modeling Artist',
    'ui-ux': 'UI/UX Artist',
    'vfx': 'VFX Artist',
}

const ROLES = Object.values(TITLES)
const EXPERIENCE = ['Less than 1 year', '1–2 years', '3–5 years', '5+ years']
const UNITY = ['None', 'Some', 'Comfortable', 'Expert']
const AVAILABILITY = ['A few hours a week', '10–20 hours a week', '20–40 hours a week', 'Full-time']

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgaoqzld'
const NEPHESH_EMAIL = 'contact@nepheshgames.com'

const MIN_AGE = 16
const MAX_AGE = 120
const MIN_LONG_TEXT = 30   // experience_details, motivation
const MIN_TOOLS = 3

// ---- validation ----------------------------------------------------------

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/
const PLACEHOLDER_DOMAINS = ['example.com', 'example.org', 'example.net', 'test.com', 'domain.com', 'email.com']
const NAME_PART_RE = /^\p{L}[\p{L}'’-]*$/u   // letters, hyphens and apostrophes (O'Brien)
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

// Low-effort text: too few distinct characters, a short unit repeated over and over
// ("wvwvwvwv", "fwwwfw"), a keyboard-row mash ("asdfgh"), or the same word on repeat.
function isJunk(text, minUnique = 6) {
    const s = text.toLowerCase().replace(/\s+/g, '')
    if (!s) return true
    if (new Set(s).size < Math.min(minUnique, s.length)) return true
    if (s.length >= 6 && /^(.{1,8})\1{2,}$/.test(s)) return true
    for (const row of KEYBOARD_ROWS) {
        const rev = [...row].reverse().join('')
        for (let i = 0; i + 5 <= row.length; i++) {
            if (s.includes(row.slice(i, i + 5)) || s.includes(rev.slice(i, i + 5))) return true
        }
    }
    const words = text.toLowerCase().split(/\s+/).filter(Boolean)
    return words.length >= 6 && new Set(words).size < 3
}

function isValidEmail(email) {
    if (!EMAIL_RE.test(email) || email.includes('..')) return false
    const [local, domain] = email.split('@')
    if (local.startsWith('.') || local.endsWith('.') || local.length > 64) return false
    return !PLACEHOLDER_DOMAINS.includes(domain.toLowerCase())
}

function isValidUrl(value) {
    if (/\s/.test(value)) return false
    try {
        const u = new URL(value)
        return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.')
    } catch {
        return false
    }
}

// Returns { fieldName: message } for every failing field; empty object = valid.
// `data` holds trimmed strings plus `consent` as a boolean.
function validate(data) {
    const errors = {}

    const parts = data.name.split(/\s+/).filter(Boolean)
    if (parts.length < 2 || !parts.every((p) => p.length >= 2 && NAME_PART_RE.test(p) && !/^(.)\1+$/u.test(p))) {
        errors.name = 'Please enter your first and last name (letters only, at least 2 letters each).'
    }

    if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email address.'

    const age = Number(data.age)
    if (data.age === '' || !Number.isInteger(age)) errors.age = `Please enter your age. You must be at least ${MIN_AGE} to apply.`
    else if (age < MIN_AGE) errors.age = `You must be at least ${MIN_AGE} to apply.`
    else if (age > MAX_AGE) errors.age = 'Please enter a valid age.'

    if (!data.role) errors.role = 'Please choose a role.'

    if (data.portfolio && !isValidUrl(data.portfolio)) {
        errors.portfolio = 'Please enter a full link starting with http:// or https://.'
    }

    if (data.experience_details.length < MIN_LONG_TEXT || isJunk(data.experience_details)) {
        errors.experience_details = `Please tell us what you've worked on (at least ${MIN_LONG_TEXT} characters, in your own words).`
    }

    if (data.tools.length < MIN_TOOLS || isJunk(data.tools, 3)) {
        errors.tools = 'Please list the software and tools you use.'
    }

    if (data.motivation.length < MIN_LONG_TEXT || isJunk(data.motivation)) {
        errors.motivation = `Please tell us why you want to join (at least ${MIN_LONG_TEXT} characters, in your own words).`
    }

    if (!data.consent) errors.consent = 'You need to agree before you can apply.'

    return errors
}

export default function ApplyForm() {
    const { position } = useParams()
    const title = TITLES[position] || 'Position'
    const [role, setRole] = useState(TITLES[position] || '')
    const [status, setStatus] = useState('idle') // idle | submitting | success | error
    const [errors, setErrors] = useState({})

    // typing in a field clears just that field's message
    const clearError = (e) => {
        const key = e.target.name
        if (key && errors[key]) setErrors(({ [key]: _gone, ...rest }) => rest)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (status === 'submitting') return
        const form = e.currentTarget

        // field names are the form's own `name` attributes; the email field doubles as Formspree's reply-to
        const data = Object.fromEntries(
            Object.entries(Object.fromEntries(new FormData(form)))
                .map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
        )
        const consent = form.elements.consent.checked

        const found = validate({ ...data, consent })
        setErrors(found)
        const firstBad = Object.keys(found)[0]
        if (firstBad) {
            form.elements[firstBad]?.focus()
            return
        }

        data.consent = consent ? 'Yes' : 'No'
        if (position) data.position = position
        data._subject = `New Lords of Elzorn application — ${data.role || title} — ${data.name || ''}`.trim()

        setStatus('submitting')
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
            form.reset()
            setRole(TITLES[position] || '')
            setStatus('success')
        } catch {
            setStatus('error')
        }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#1a0e0e', color: '#e2ddd0',
            fontFamily: "'Inter', sans-serif",
        }}>
            <style>{`
                .af-field input, .af-field select, .af-field textarea {
                    width: 100%; padding: 12px 16px; border-radius: 8px;
                    background: #241515; border: 1px solid rgba(201,146,42,0.2);
                    color: #e2ddd0; font-size: 15px; font-family: 'Inter', sans-serif;
                    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
                }
                .af-field input::placeholder, .af-field textarea::placeholder { color: #6f675c; }
                .af-field input:focus, .af-field select:focus, .af-field textarea:focus {
                    border-color: #e8b84b; box-shadow: 0 0 0 3px rgba(201,146,42,0.18);
                }
                .af-field select { appearance: none; cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23c9922a' stroke-width='1.6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
                .af-field textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
                .af-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .af-check input { accent-color: #c9922a; width: 18px; height: 18px; margin-top: 2px; flex: none; }
                .af-field.af-invalid input, .af-field.af-invalid select, .af-field.af-invalid textarea { border-color: #c9922a; background: #2a1818; }
                .af-error { display: block; margin-top: 8px; padding: 8px 12px; border-left: 2px solid #c9922a;
                    background: #2a1818; color: #e8b84b; font-size: 13px; line-height: 1.5; text-transform: none; letter-spacing: 0; }
                .af-hp { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }
                .af-submit:hover { background: rgba(201,146,42,0.3); }
                .af-submit:focus-visible { outline: 2px solid #e8b84b; outline-offset: 3px; }
                @media (max-width: 768px) { .af-row { grid-template-columns: 1fr; } }
            `}</style>

            <Link to="/apply" style={{
                position: 'fixed', top: 24, left: 24, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#8a8478', textDecoration: 'none', fontSize: 13,
                letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
                ← Back to Positions
            </Link>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>
                <div style={{ marginBottom: 40 }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a', marginBottom: 12, fontFamily: "'Cinzel', serif" }}>Lords of Elzorn</p>
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '0.05em' }}>
                        Apply — {title}
                    </h1>
                </div>

                {status === 'success' ? (
                    <div role="status" style={{
                        background: '#2a1818', border: '1px solid #c9922a', borderRadius: 12,
                        padding: 'clamp(24px, 5vw, 40px)', textAlign: 'center',
                    }}>
                        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, letterSpacing: '0.05em', color: '#e8b84b', marginBottom: 12 }}>
                            Application Sent
                        </h2>
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#b5b0a4', marginBottom: 24 }}>
                            Thank you for applying. We'll review your application and get back to you by email.
                        </p>
                        <Link to="/apply" style={{ color: '#e8b84b', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
                            ← Back to Positions
                        </Link>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} onChange={clearError} noValidate style={{
                    background: '#241515', border: '1px solid rgba(201,146,42,0.2)',
                    borderRadius: 12, padding: 'clamp(24px, 5vw, 40px)',
                    display: 'flex', flexDirection: 'column', gap: 40,
                }}>
                    {/* honeypot: real visitors never see or tab to it; Formspree drops submissions that fill it */}
                    <div className="af-hp" aria-hidden="true">
                        <label>Leave this empty
                            <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                        </label>
                    </div>

                    <Group label="About You">
                        <Field label="Full Name" required error={errors.name}>
                            <input name="name" type="text" required autoComplete="name" />
                        </Field>
                        <Field label="Email" required error={errors.email}>
                            <input name="email" type="email" required autoComplete="email" />
                        </Field>
                        <div className="af-row">
                            <Field label="Age" required error={errors.age}>
                                <input name="age" type="number" min="1" max="120" inputMode="numeric" />
                            </Field>
                            <Field label="Country">
                                <select name="country" defaultValue="" autoComplete="country-name">
                                    <option value="" disabled>Choose...</option>
                                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </Field>
                        </div>
                        <Field label="Discord Username" optional>
                            <input name="discord" type="text" />
                        </Field>
                    </Group>

                    <Group label="Your Work">
                        <div className="af-row">
                            <Field label="Role you're applying for" required error={errors.role}>
                                <select name="role" required value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="" disabled>Select a role</option>
                                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </Field>
                            <Field label="Years of Experience">
                                <select name="experience" defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {EXPERIENCE.map((x) => <option key={x} value={x}>{x}</option>)}
                                </select>
                            </Field>
                        </div>
                        <Field label="Portfolio / Reel Link" hint="ArtStation, Behance or your own site" error={errors.portfolio}>
                            <input name="portfolio" type="url" placeholder="https://..." />
                        </Field>
                        <Field label="What have you worked on so far?" required hint="Games, studios, freelance or personal projects. Mention what you made or built." error={errors.experience_details}>
                            <textarea name="experience_details" rows={5} />
                        </Field>
                        <Field label="Software & Tools you use" required error={errors.tools}>
                            <input name="tools" type="text" placeholder="Blender, Substance, Photoshop, Figma, Houdini..." />
                        </Field>
                        <div className="af-row">
                            <Field label="Unity Experience">
                                <select name="unity" defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {UNITY.map((x) => <option key={x} value={x}>{x}</option>)}
                                </select>
                            </Field>
                            <Field label="Weekly Availability">
                                <select name="availability" defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {AVAILABILITY.map((x) => <option key={x} value={x}>{x}</option>)}
                                </select>
                            </Field>
                        </div>
                    </Group>

                    <Group label="Why Lords of Elzorn">
                        <Field label="Why do you want to work on this project?" required error={errors.motivation}>
                            <textarea name="motivation" rows={6} />
                        </Field>
                        <label className="af-check" style={{
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                            fontSize: 14, lineHeight: 1.6, color: '#b5b0a4', cursor: 'pointer',
                        }}>
                            <input name="consent" type="checkbox" required />
                            <span>I agree that Nephesh Game Studio stores this information to review my application.</span>
                        </label>
                        {errors.consent && <span className="af-error" role="alert">{errors.consent}</span>}
                        {Object.keys(errors).length > 0 && (
                            <div role="alert" style={{
                                padding: '14px 18px', borderRadius: 8, background: '#2a1818',
                                border: '1px solid #c9922a', color: '#e8b84b', fontSize: 14, lineHeight: 1.6,
                            }}>
                                Please fix the highlighted fields and try again.
                            </div>
                        )}
                        {status === 'error' && (
                            <div role="alert" style={{
                                padding: '14px 18px', borderRadius: 8, background: '#2a1818',
                                border: '1px solid #c9922a', color: '#e8b84b', fontSize: 14, lineHeight: 1.6,
                            }}>
                                Something went wrong sending your application. Please try again, or email us directly at{' '}
                                <a href={`mailto:${NEPHESH_EMAIL}`} style={{ color: '#e8b84b' }}>{NEPHESH_EMAIL}</a>.
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                            <button type="submit" className="af-submit" disabled={status === 'submitting'} style={{
                                padding: '14px 32px', borderRadius: 100, border: '1px solid #c9922a',
                                background: 'rgba(201,146,42,0.15)', color: '#e8b84b',
                                fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase',
                                fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
                                ...(status === 'submitting' && { opacity: 0.6, cursor: 'wait' }),
                            }}>
                                {status === 'submitting' ? 'Sending…' : 'Send Application'}
                            </button>
                            <span style={{ fontSize: 13, color: '#8a8478' }}>
                                Prefer email? Write to{' '}
                                <a href={`mailto:${NEPHESH_EMAIL}`} style={{ color: '#e8b84b' }}>{NEPHESH_EMAIL}</a>
                            </span>
                        </div>
                    </Group>
                </form>
                )}
            </div>
        </div>
    )
}

function Group({ label, children }) {
    return (
        <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <legend style={{
                width: '100%', paddingBottom: 12, marginBottom: 4,
                fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600,
                letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9922a',
                borderBottom: '1px solid rgba(201,146,42,0.2)',
            }}>
                {label}
            </legend>
            {children}
        </fieldset>
    )
}

function Field({ label, required, optional, hint, error, children }) {
    return (
        <label className={error ? 'af-field af-invalid' : 'af-field'} style={{ display: 'block' }}>
            <span style={{
                display: 'block', fontSize: 12, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#8a8478', marginBottom: 8,
            }}>
                {label}
                {required && <span style={{ color: '#c9922a' }}> *</span>}
                {optional && <span style={{ textTransform: 'none', letterSpacing: 0, opacity: 0.7 }}> (optional)</span>}
            </span>
            {children}
            {hint && <span style={{ display: 'block', fontSize: 12, color: '#6f675c', marginTop: 6 }}>{hint}</span>}
            {error && <span className="af-error" role="alert">{error}</span>}
        </label>
    )
}
