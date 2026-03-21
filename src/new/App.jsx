import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [companyName, setCompanyName] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setFileName(f.name)
    }
  }

  const handleStart = async () => {
    if (!companyName.trim() || !file) return

    setIsRunning(true)
    setSubmitted(false)

    const formData = new FormData()
    formData.append('companyName', companyName)
    formData.append('file', file)

    try {
      const res = await fetch(
        'https://n8n.b2botix.ai/webhook/automation_engine',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!res.ok) throw new Error('Upload failed')

      setSubmitted(true)
      alert('File sent successfully ✅')
    } catch (err) {
      console.error(err)
      alert('Upload failed ❌')
    } finally {
      setIsRunning(false)
    }
  }

  const canStart = companyName.trim() && file && !isRunning

  const agents = [
    {
      id: 1,
      name: 'Agent One',
      role: 'Data Ingestion & Parsing',
      color: 'cyan',
      icon: '⬡',
      delay: '0.3s',
    },
    {
      id: 2,
      name: 'Agent Two',
      role: 'Analysis & Enrichment',
      color: 'pink',
      icon: '◈',
      delay: '0.45s',
    },
    {
      id: 3,
      name: 'Agent Three',
      role: 'Report Generation',
      color: 'amber',
      icon: '◉',
      delay: '0.6s',
    },
  ]

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="header">
        <div className="header-eyebrow">
          <span className="eyebrow-dot" />
          Powered by n8n Automation
        </div>
        <h1>MOTM's<br />Intelligent Engine</h1>
        <p className="subtitle">
          Upload your data and let the three-agent pipeline do the heavy lifting.
        </p>
      </header>

      <section className="input-section">
        <div className="section-label">
          <span className="section-num">01</span>
          Configure your workflow
        </div>

        <div className="fields-row">
          <div className="field">
            <label htmlFor="company">Company name</label>
            <div className="input-wrapper">
              <span className="input-icon">🏢</span>
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="field">
            <label>Input file</label>
            <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={isRunning}
                className="file-input-hidden"
              />
              <div className="file-drop-inner">
                {fileName ? (
                  <>
                    <span className="file-icon-big">📄</span>
                    <span className="file-chosen-name">{fileName}</span>
                    <span className="file-change-hint">Click to change</span>
                  </>
                ) : (
                  <>
                    <span className="file-icon-big">⬆</span>
                    <span className="file-chosen-name">Drop file or click to browse</span>
                    <span className="file-change-hint">Any file type accepted</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          className={`btn-primary ${isRunning ? 'btn-loading' : ''}`}
          onClick={handleStart}
          disabled={!canStart}
        >
          {isRunning ? (
            <>
              <span className="spinner" />
              Sending to pipeline…
            </>
          ) : (
            <>
              <span className="btn-icon">▶</span>
              Launch Workflow
            </>
          )}
        </button>
      </section>

      <section className="agents-section">
        <div className="section-label">
          <span className="section-num">02</span>
          Agent Pipeline
        </div>

        <div className="agents-track">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              className={`agent-card agent-${agent.color}`}
              style={{ animationDelay: agent.delay }}
            >
              <div className="agent-connector">
                {i < agents.length - 1 && (
                  <div className="connector-line">
                    <div className="connector-arrow">›</div>
                  </div>
                )}
              </div>

              <div className="agent-glow-bg" />

              <div className="agent-top">
                <div className="agent-icon-wrap">
                  <span className="agent-hex">{agent.icon}</span>
                  <span className="agent-num">0{agent.id}</span>
                </div>
                <div className="agent-status-dot" />
              </div>

              <div className="agent-meta">
                <h3>{agent.name}</h3>
                <p className="agent-role">{agent.role}</p>
              </div>

              <div className="agent-preview-area">
                <div className="preview-header">
                  <span className="preview-label">Output Preview</span>
                  <span className="preview-badge">Standby</span>
                </div>
                <div className="preview-content">
                  <div className="preview-skeleton">
                    <div className="skel skel-wide" />
                    <div className="skel skel-mid" />
                    <div className="skel skel-wide" />
                    <div className="skel skel-narrow" />
                    <div className="skel skel-mid" />
                  </div>
                  <p className="preview-placeholder-text">
                    Preview will appear here once this agent completes its task.
                  </p>
                </div>
              </div>

              <div className="agent-footer">
                <div className="agent-tag">Waiting for input</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
