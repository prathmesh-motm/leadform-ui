import { useState } from 'react'
import './App.css'

const WEBHOOK_URL = 'https://n8n.b2botix.ai/webhook/9e1ae0cd-d3fc-4920-9671-4ad4dc37d0b1'

const ICP_SUGGESTIONS = [
  'Chemical Manufacturer',
  'Pharmaceutical',
  'Tool Manufacturer',
  'Automotive',
  'Heavy Engineering',
  'Additive Manufacturing',
  'Embedded Systems',
  'Industrial Automation'
]

const LOCATION_SUGGESTIONS = [
  'Pune', 'Mumbai', 'Delhi', 'Bangalore',
  'Hyderabad', 'Chennai', 'Ahmedabad', 'Surat',
]

export default function LeadForm() {
  const [icp, setIcp] = useState('')
  const [location, setLocation] = useState('')
  const [icpSuggest, setIcpSuggest] = useState(false)
  const [locSuggest, setLocSuggest] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const filteredIcp = ICP_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(icp.toLowerCase()) && icp.length > 0
  )
  const filteredLoc = LOCATION_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(location.toLowerCase()) && location.length > 0
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!icp.trim() || !location.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ICP: icp.trim(),
          Location: location.trim(),
        }),
      })

      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setIcp('')
    setLocation('')
    setStatus('idle')
    setErrorMsg('')
  }

  const canSubmit = icp.trim() && location.trim() && status !== 'loading'

  return (
    <div className="lf-page">

      {/* NAV */}
      <nav className="lf-nav">
        <div className="lf-nav-brand">
          <div className="lf-logo-icon">
            <svg viewBox="0 0 36 36" fill="none">
              <polyline points="4,28 12,16 18,22 26,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="26,8 32,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="lf-brand-name">MOTM Technologies</div>
            <div className="lf-brand-tag">Igniting Industrial Growth</div>
          </div>
        </div>
        <a href="https://www.motm.tech/" target="_blank" rel="noopener noreferrer" className="lf-nav-link">
          motm.tech ↗
        </a>
      </nav>

      {/* MAIN */}
      <main className="lf-main">

        {/* LEFT PANEL */}
        <div className="lf-left">
          <div className="lf-left-inner">
            <div className="lf-eyebrow">
              <span className="lf-eyebrow-dot" />
              Lead Generation Engine
            </div>

            <h1 className="lf-headline">
              Find Your<br />
              <span className="lf-headline-accent">Ideal</span><br />
              Customers
            </h1>

            <p className="lf-left-sub">
              Tell us your Ideal Customer Profile and target location. Our intelligent pipeline will discover, enrich, and deliver qualified B2B leads directly to you.
            </p>

            <div className="lf-features">
              {[
                { icon: '🎯', title: 'ICP Targeting',   desc: 'Precision targeting for engineering & industrial sectors' },
                { icon: '📍', title: 'Location Mapping', desc: 'Hyper-local lead discovery across Indian markets'         },
                { icon: '⚡', title: 'Auto Pipeline',    desc: 'n8n-powered 3-agent enrichment & outreach flow'          },
              ].map((f, i) => (
                <div className="lf-feature" key={i} style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="lf-feature-icon">{f.icon}</div>
                  <div>
                    <div className="lf-feature-title">{f.title}</div>
                    <div className="lf-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lf-stats-row">
              {[['B2B', 'Focused'],['SME', 'Specialist'],['n8n', 'Powered']].map(([n, l], i) => (
                <div className="lf-stat" key={i}>
                  <span className="lf-stat-num">{n}</span>
                  <span className="lf-stat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="lf-blob lf-blob-1" aria-hidden="true" />
          <div className="lf-blob lf-blob-2" aria-hidden="true" />
          <div className="lf-blob lf-blob-3" aria-hidden="true" />
        </div>

        {/* RIGHT PANEL — FORM */}
        <div className="lf-right">
          <div className="lf-form-card">

            {status === 'success' ? (
              <div className="lf-success">
                <div className="lf-success-ring">
                  <div className="lf-success-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
                <h2 className="lf-success-title">Pipeline Triggered!</h2>
                <p className="lf-success-sub">
                  Your lead generation request for <strong>{icp}</strong> in <strong>{location}</strong> has been sent to the n8n pipeline. The agents will start processing shortly.
                </p>
                <div className="lf-success-detail">
                  <div className="lf-success-row">
                    <span className="lf-success-key">ICP</span>
                    <span className="lf-success-val">{icp}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-key">Location</span>
                    <span className="lf-success-val">{location}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-key">Status</span>
                    <span className="lf-success-val lf-green">✓ Submitted</span>
                  </div>
                </div>
                <button className="lf-btn-secondary" onClick={handleReset}>
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <div className="lf-form-header">
                  <div className="lf-form-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="lf-form-title">Lead Generation Form</h2>
                    <p className="lf-form-subtitle">Enter the required details to start the pipeline</p>
                  </div>
                </div>

                <div className="lf-divider" />

                <form onSubmit={handleSubmit} className="lf-form" noValidate>

                  {/* ICP Field */}
                  <div className="lf-field">
                    <label htmlFor="icp" className="lf-label">
                      <span className="lf-label-icon">🎯</span>
                      Ideal Customer Profile (ICP)
                      <span className="lf-required">*</span>
                    </label>
                    <div className="lf-input-wrap" style={{ position: 'relative' }}>
                      <input
                        id="icp"
                        type="text"
                        value={icp}
                        onChange={e => { setIcp(e.target.value); setIcpSuggest(true) }}
                        onFocus={() => setIcpSuggest(true)}
                        onBlur={() => setTimeout(() => setIcpSuggest(false), 150)}
                        placeholder="chemical, pharmaceutical, tool manufacturer, etc."
                        className={`lf-input ${icp ? 'lf-input-filled' : ''}`}
                        disabled={status === 'loading'}
                        autoComplete="off"
                      />
                      {icp && <span className="lf-input-clear" onClick={() => setIcp('')}>×</span>}
                      {icpSuggest && filteredIcp.length > 0 && (
                        <div className="lf-suggestions">
                          {filteredIcp.map(s => (
                            <div
                              key={s}
                              className="lf-suggestion-item"
                              onMouseDown={() => { setIcp(s); setIcpSuggest(false) }}
                            >
                              <span className="lf-sug-icon">🎯</span> {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="lf-chips">
                      {['Chemical', 'Pharma', 'Automotive', 'Tool Mfg'].map(chip => (
                        <button
                          type="button"
                          key={chip}
                          className={`lf-chip ${icp === chip ? 'lf-chip-active' : ''}`}
                          onClick={() => setIcp(chip)}
                        >{chip}</button>
                      ))}
                    </div>
                  </div>

                  {/* Location Field */}
                  <div className="lf-field">
                    <label htmlFor="location" className="lf-label">
                      <span className="lf-label-icon">📍</span>
                      Location
                      <span className="lf-required">*</span>
                    </label>
                    <div className="lf-input-wrap" style={{ position: 'relative' }}>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={e => { setLocation(e.target.value); setLocSuggest(true) }}
                        onFocus={() => setLocSuggest(true)}
                        onBlur={() => setTimeout(() => setLocSuggest(false), 150)}
                        placeholder="pune, mumbai, etc."
                        className={`lf-input ${location ? 'lf-input-filled' : ''}`}
                        disabled={status === 'loading'}
                        autoComplete="off"
                      />
                      {location && <span className="lf-input-clear" onClick={() => setLocation('')}>×</span>}
                      {locSuggest && filteredLoc.length > 0 && (
                        <div className="lf-suggestions">
                          {filteredLoc.map(s => (
                            <div
                              key={s}
                              className="lf-suggestion-item"
                              onMouseDown={() => { setLocation(s); setLocSuggest(false) }}
                            >
                              <span className="lf-sug-icon">📍</span> {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="lf-chips">
                      {['Pune', 'Mumbai', 'Delhi', 'Bangalore'].map(chip => (
                        <button
                          type="button"
                          key={chip}
                          className={`lf-chip ${location === chip ? 'lf-chip-active' : ''}`}
                          onClick={() => setLocation(chip)}
                        >{chip}</button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <div className="lf-error-box">
                      <span>⚠</span> {errorMsg}
                    </div>
                  )}

                  {/* Payload preview */}
                  {(icp || location) && (
                    <div className="lf-payload-preview">
                      <div className="lf-payload-label">Request payload preview</div>
                      <pre className="lf-payload-code">{JSON.stringify({ ICP: icp || '…', Location: location || '…' }, null, 2)}</pre>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`lf-submit-btn ${status === 'loading' ? 'lf-btn-loading' : ''}`}
                    disabled={!canSubmit}
                  >
                    {status === 'loading' ? (
                      <><span className="lf-spinner" /> Sending to Pipeline…</>
                    ) : (
                      <>
                        <span className="lf-btn-play">▶</span>
                        Start Lead Generation
                        <span className="lf-btn-arrow">→</span>
                      </>
                    )}
                  </button>

                  <p className="lf-form-note">
                    Data is sent via POST to the n8n automation pipeline. Both fields are required.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
