import { useState, useRef, useEffect } from 'react'
import './App.css'

// import { useEffect, useState } from "react"
// import { supabase } from "../lib/supabase"

import { supabase } from './api/supabase'


const AGENTS = [
  {
    id: 1,
    label: 'AGENT 1',
    name: 'Diagnosis Engine',
    role: 'Customer Analysis',
    desc: 'Parses and validates your uploaded file, extracting structured signals ready for deep analysis.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: 'AGENT 2',
    name: 'Reverse Revenue Funnel Engine',
    role: 'Strategic Sales & Engagement Framework',
    desc: 'Runs deep market intelligence on the ingested data, enriching it with contextual B2B signals.',
    // link: 'https://yourdomain.com/agent1-preview',  // 👈 add this
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: 'AGENT 3',
    name: 'Strategy Output Engine',
    role: 'Revenue Strategy Analysis',
    desc: 'Synthesises all findings into a structured, actionable outreach report tailored to your company.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const fileInputRef = useRef(null)

  const [agents, setAgents] = useState(AGENTS);

useEffect(() => {
  if (!companyName) return;

  const interval = setInterval(async () => {
    const { data } = await supabase
      .from("MOTM CLIENT DATABASE")
      .select("agent1_link, agent2_link, agent3_link")
      .eq("companyName", companyName)
      .maybeSingle();

    if (data?.agent1_link) {
      setAgents(prev => {
        const updated = prev.map(agent => {
          if (agent.id === 1) return { ...agent, link: data.agent1_link }
          if (agent.id === 2) return { ...agent, link: data.agent2_link }
          if (agent.id === 3) return { ...agent, link: data.agent3_link }
          return agent
        })

        console.log("Updated agents:", updated)
        return updated
      })
      // );

      clearInterval(interval); // stop polling once ready
    }
  }, 3000); // every 3 seconds

  return () => clearInterval(interval);
}, [companyName]);



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
    const formData = new FormData()
    formData.append('companyName', companyName)
    formData.append('file', file)
    try {
      const res = await fetch('https://n8n.b2botix.ai/webhook/automation_engine', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
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

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo-icon">
            {/* <svg viewBox="0 0 36 36" fill="none">
              <polyline points="4,28 12,16 18,22 26,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="26,8 32,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> */}
            {/* <img src="/logo.jpg" alt="MOTM Logo" className="logo-img" /> */}
            <img fetchpriority="high" width="1080" height="1080" src="https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo.png" class="custom-logo" alt="MOT Marketing Technologies" decoding="async" srcset="https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo.png 1080w, https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo-300x300.png 300w, https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo-1024x1024.png 1024w, https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo-150x150.png 150w, https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo-768x768.png 768w, https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo-600x600.png 600w" sizes="(max-width: 1080px) 100vw, 1080px"></img>
          </div>
          <div className="nav-brand-text">
            <span className="nav-name">MOTM Technologies</span>
            <span className="nav-tagline">Igniting Industrial Growth</span>
          </div>
        </div>
        <span className="nav-badge">Intelligent Engine</span>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-blob" aria-hidden="true" />
        <div className="hero-content">
          {/* <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Powered by n8n Automation
          </div> */}
          <h1 className="hero-title">
            Marketing, Sales &amp;<br />
            <span className="hero-accent">Transformation</span><br />
            for Your B2B Business
          </h1>
          <p className="hero-sub">
            A dedicated Engineering &amp; Technology product B2B intelligence platform. Upload your data and let the three-agent pipeline find leads, enrich signals, and generate your report automatically.
          </p>
          {/* <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">AI Agents</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Automated</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">n8n</span>
              <span className="stat-label">Powered</span>
            </div>
          </div> */}
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="vis-card vis-card-main">
            <div className="vis-topbar">
              <span className="vis-dot" /><span className="vis-dot" /><span className="vis-dot" />
              <span className="vis-label">Pipeline Dashboard</span>
            </div>
            <div className="vis-bars">
              {[85,60,75,45,90,55].map((w,i)=>(
                <div key={i} className="vis-bar-row">
                  <div className="vis-bar" style={{width:`${w}%`, animationDelay:`${i*0.15}s`}} />
                </div>
              ))}
            </div>
            <div className="vis-chart">
              <svg viewBox="0 0 120 50" fill="none">
                <polyline points="0,40 20,28 40,32 65,14 85,22 120,6" stroke="#C41E8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset="200" className="chart-line"/>
                <polyline points="0,40 20,28 40,32 65,14 85,22 120,6 120,50 0,50" stroke="none" fill="url(#mgrad)" opacity="0.15"/>
                <defs>
                  <linearGradient id="mgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C41E8C" />
                    <stop offset="100%" stopColor="#C41E8C" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="vis-badge vis-badge-1">
            <span className="vis-badge-icon">✓</span>
            Agent 1 Complete
          </div>
          <div className="vis-badge vis-badge-2">
            <span className="vis-badge-icon">⚡</span>
            Processing…
          </div>
        </div>
      </section>

      {/* WAVE */}
      <div className="wave-wrap" aria-hidden="true">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#F0F0F6"/>
        </svg>
      </div>

      {/* CONFIGURE */}
      <section className="configure-section">
        <div className="section-header">
          <div className="section-eyebrow">Step 01</div>
          <h2 className="section-title">Configure Your Workflow</h2>
          <p className="section-sub">Enter your company details and upload the source file to begin the automated pipeline.</p>
        </div>

        <div className="config-card">
          <div className="config-card-accent" />
          <div className="form-grid">
            <div className="field-block">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Engineering Ltd."
                disabled={isRunning}
                className="text-input"
              />
            </div>
            <div className="field-block">
              <label>Upload Source File</label>
              <div
                className={`drop-zone ${fileName ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input ref={fileInputRef} type="file" onChange={handleFileChange} disabled={isRunning} className="hidden-input" />
                {fileName ? (
                  <div className="dz-inner">
                    <span className="dz-file-emoji">📄</span>
                    <div>
                      <div className="dz-filename">{fileName}</div>
                      <div className="dz-hint">Click to replace</div>
                    </div>
                    <span className="dz-check">✓</span>
                  </div>
                ) : (
                  <div className="dz-inner">
                    <div className="dz-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <div className="dz-filename">Drop file or click to browse</div>
                      <div className="dz-hint">Any file type accepted</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="launch-btn" onClick={handleStart} disabled={!canStart}>
            {isRunning ? (
              <><span className="btn-spinner" />Launching pipeline…</>
            ) : (
              <><span className="btn-play">▶</span>Launch Intelligent Workflow</>
            )}
          </button>
        </div>
      </section>

      {/* WAVE 2 */}
      <div className="wave-wrap wave-flip" aria-hidden="true">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0,35 C360,0 1080,70 1440,35 L1440,0 L0,0 Z" fill="#F0F0F6"/>
        </svg>
      </div>

      {/* PIPELINE */}
      <section className="pipeline-section">
        <div className="section-header">
          <div className="section-eyebrow">Step 02</div>
          <h2 className="section-title">Three-Agent Pipeline</h2>
          <p className="section-sub">Our intelligent agents run sequentially — each building on the output of the last to deliver complete B2B intelligence.</p>
        </div>

        <div className="agents-row">
          {/* {AGENTS.map((agent, i) => ( */}
          {agents.map((agent, i) => (
            <div className="agent-card" key={agent.id} style={{ animationDelay: `${i * 0.12}s` }}>
              {i < AGENTS.length - 1 && (
                <div className="agent-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}

              <div className="agent-circle-icon">
                {agent.icon}
              </div>

              <div className="agent-meta">
                <span className="agent-num-tag">{agent.label}</span>
                <h3 className="agent-name">{agent.name}</h3>
                <p className="agent-role">{agent.role}</p>
              </div>

              <p className="agent-desc">{agent.desc}</p>

              <div className="agent-terminal">
                <div className="terminal-bar">
                  <div className="terminal-dots">
                    <span className="t-dot t-red"/><span className="t-dot t-yellow"/><span className="t-dot t-green"/>
                  </div>
                  <span className="terminal-title">output_preview.log</span>
                  <span className="terminal-badge">standby</span>
                </div>
                <div className="terminal-body">
                  <div className="skel-lines">
                    <div className="skel s-full" />
                    <div className="skel s-3q" />
                    <div className="skel s-full" />
                    <div className="skel s-half" />
                    <div className="skel s-3q" />
                  </div>
                  <p className="terminal-hint">Output will appear here once the agent completes.</p>
                </div>
              </div>

              {/* <div className="agent-status-row">
                <span className="waiting-dot" />
                <span className="waiting-text">Waiting for input</span>
              </div> */}

              <div className="agent-status-row">
                <span className="waiting-dot" />
                
                {!agent.link ? (
                  <span className="waiting-text">Waiting for input</span>
                ) : (
                  <button
                    className="preview-btn"
                    // onClick={() => window.open(agent.link, "_blank")}
                    onClick={() => window.open(agent.link, "_blank", "noopener,noreferrer")}
                  >
                    Preview Report
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#1A1D3B"/>
          </svg>
        </div>
        <div className="footer-body">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="footer-logo-icon">
                {/* <svg viewBox="0 0 36 36" fill="none">
                  <polyline points="4,28 12,16 18,22 26,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="26,8 32,8 32,14" stroke="#C41E8C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> */}
                <img src="/logo.jpg" alt="MOTM Logo" className="logo-img" />
              </div>
              <div>
                <div className="footer-name">MOTM Technologies</div>
                <div className="footer-tagline">Igniting Industrial Growth</div>
              </div>
            </div>
            <p className="footer-copy">
              The only Engineering &amp; Technology B2B intelligence platform combining market discovery with hyper-personalised outreach automation.
            </p>
          </div>
          <div className="footer-right">
            <a href="https://www.motm.tech/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Visit motm.tech ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
