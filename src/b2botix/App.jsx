import { useState, useRef } from 'react'
import './App.css'

const AGENTS = [
  {
    id: 1,
    label: '01',
    name: 'Data Ingestion',
    desc: 'Parses and validates your uploaded file, extracting structured data for processing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: '02',
    name: 'Analysis & Enrichment',
    desc: 'Runs intelligent analysis on ingested data, enriching it with contextual signals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: '03',
    name: 'Report Generation',
    desc: 'Synthesises all findings into a structured, actionable output report.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

export default function App() {
  const [companyName, setCompanyName] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setFileName(f.name) }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) { setFile(f); setFileName(f.name) }
  }

  const handleStart = async () => {
    if (!companyName.trim() || !file) return
    setIsRunning(true)
    setDone(false)

    const formData = new FormData()
    formData.append('companyName', companyName)
    formData.append('file', file)

    try {
      const res = await fetch('https://n8n.b2botix.ai/webhook/automation_engine', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      setDone(true)
      alert('Workflow launched successfully ✅')
    } catch (err) {
      console.error(err)
      alert('Upload failed ❌')
    } finally {
      setIsRunning(false)
    }
  }

  const canStart = companyName.trim() && file && !isRunning

  return (
    <div className="app">

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">
          B2<span className="logo-paw">🐾</span>TIX
        </div>
        <div className="nav-label">Intelligent Engine</div>
      </nav>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="hero-pill">Powered by n8n · Three-Agent Pipeline</div>
        <h1 className="hero-title">
          MOTM's<br />
          <span className="hero-orange">Intelligent</span><br />
          Engine
        </h1>
        <p className="hero-sub">
          Upload a file, enter a company name, and let the three-agent pipeline find leads, enrich data, and generate your report.
        </p>
      </header>

      {/* ── INPUT CARD ── */}
      <section className="input-card">
        <div className="card-tag">Configure workflow</div>

        <div className="form-grid">
          <div className="field-block">
            <label htmlFor="company">Company name</label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              disabled={isRunning}
              className="text-input"
            />
          </div>

          <div className="field-block">
            <label>Upload file</label>
            <div
              className={`drop-zone ${fileName ? 'has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={isRunning}
                className="hidden-input"
              />
              {fileName ? (
                <div className="drop-zone-inner">
                  <span className="dz-file-icon">📄</span>
                  <div>
                    <div className="dz-file-name">{fileName}</div>
                    <div className="dz-hint">Click to replace</div>
                  </div>
                </div>
              ) : (
                <div className="drop-zone-inner">
                  <span className="dz-upload-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </span>
                  <div>
                    <div className="dz-file-name">Drop file or click to browse</div>
                    <div className="dz-hint">Any file type accepted</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className="launch-btn" onClick={handleStart} disabled={!canStart}>
          {isRunning ? (
            <><span className="btn-spinner" /> Launching pipeline…</>
          ) : (
            <> Launch Workflow <span className="btn-arrow">→</span></>
          )}
        </button>
      </section>

      {/* ── PIPELINE SECTION ── */}
      <section className="pipeline-section">
        <div className="pipeline-header">
          <span className="card-tag">Three-agent pipeline</span>
          <p className="pipeline-desc">Each agent runs sequentially, passing its output to the next.</p>
        </div>

        <div className="agents-grid">
          {AGENTS.map((agent, i) => (
            <div className="agent-card" key={agent.id} style={{ animationDelay: `${i * 0.1}s` }}>

              {/* connector arrow between cards */}
              {i < AGENTS.length - 1 && (
                <div className="arrow-connector" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}

              <div className="agent-top">
                <div className="agent-icon">{agent.icon}</div>
                <span className="agent-num">{agent.label}</span>
              </div>

              <div className="agent-body">
                <h3 className="agent-name">{agent.name}</h3>
                <p className="agent-desc">{agent.desc}</p>
              </div>

              <div className="preview-box">
                <div className="preview-topbar">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-title">Output preview</span>
                  <span className="preview-status">Standby</span>
                </div>
                <div className="preview-body">
                  <div className="skel-lines">
                    <div className="skel s-full" />
                    <div className="skel s-3q" />
                    <div className="skel s-full" />
                    <div className="skel s-half" />
                    <div className="skel s-3q" />
                  </div>
                  <p className="preview-hint">Preview will appear here once this agent completes.</p>
                </div>
              </div>

              <div className="agent-footer">
                <span className="status-pill">Waiting for input</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-logo">B2<span className="logo-paw">🐾</span>TIX</div>
        <p className="footer-copy">The only platform that combines local market discovery with global trade intelligence.</p>
      </footer>
    </div>
  )
}
