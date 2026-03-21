import { useState, useRef, useCallback } from 'react'
import './App.css'

const WEBHOOK_URL = 'https://n8n.b2botix.ai/webhook/lead_gen_form'
const MOTM_LOGO   = 'https://www.motm.tech/wp-content/uploads/2020/03/Final-MOTM-logo.png'

const ICP_POOL = [
  'Chemical Manufacturer', 'Pharmaceutical', 'Tool Manufacturer',
  'Automotive', 'Heavy Engineering', 'Additive Manufacturing',
  'Embedded Systems', 'Industrial Automation', 'Defence',
  'Micro Controllers', 'IoT & Sensors',
]

const LOC_POOL = [
  'Pune', 'Mumbai', 'Delhi', 'Bangalore',
  'Hyderabad', 'Chennai', 'Ahmedabad', 'Surat',
  'Nashik', 'Nagpur', 'Coimbatore', 'Ludhiana',
]

const ICP_QUICK  = ['Chemical manufacturer', 'Pharmaceutical company', 'Automotive', 'Tool Manufacturer', 'FMCG manufacturer']
const LOC_QUICK  = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']

/* ─── Reusable tag-input ─────────────────────────────────── */
function TagInput({ id, tags, setTags, pool, quickList, placeholder, icon, disabled }) {
  const [draft, setDraft]       = useState('')
  const [showDrop, setShowDrop] = useState(false)
  const inputRef                = useRef(null)

  const suggestions = pool.filter(
    s => s.toLowerCase().includes(draft.toLowerCase()) &&
         draft.trim().length > 0 &&
         !tags.map(t => t.toLowerCase()).includes(s.toLowerCase())
  )

  const addTag = useCallback((raw) => {
    const vals = raw.split(',').map(v => v.trim()).filter(Boolean)
    setTags(prev => {
      const existing = prev.map(t => t.toLowerCase())
      const fresh    = vals.filter(v => !existing.includes(v.toLowerCase()))
      return [...prev, ...fresh]
    })
    setDraft('')
    setShowDrop(false)
  }, [setTags])

  const removeTag = (i) => setTags(prev => prev.filter((_, idx) => idx !== i))

  const handleKey = (e) => {
    if ((e.key === ',' || e.key === 'Enter') && draft.trim()) {
      e.preventDefault()
      addTag(draft)
    }
    if (e.key === 'Backspace' && !draft && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const toggleQuick = (chip) => {
    const already = tags.map(t => t.toLowerCase()).includes(chip.toLowerCase())
    if (already) setTags(prev => prev.filter(t => t.toLowerCase() !== chip.toLowerCase()))
    else         setTags(prev => [...prev, chip])
  }

  return (
    <div className="lf-field">
      <label htmlFor={id} className="lf-label">
        <span className="lf-label-icon">{icon}</span>
        {id === 'icp' ? 'Ideal Customer Profile (ICP)' : 'Location'}
        <span className="lf-required">*</span>
        <span className="lf-label-hint">— separate multiple with comma or Enter</span>
      </label>

      {/* Tag box */}
      <div
        className={`lf-tagbox ${tags.length ? 'lf-tagbox-filled' : ''} ${disabled ? 'lf-tagbox-disabled' : ''}`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* Existing tags */}
        {tags.map((tag, i) => (
          <span className="lf-tag" key={i}>
            {tag}
            <button
              type="button"
              className="lf-tag-remove"
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              disabled={disabled}
              aria-label={`Remove ${tag}`}
            >×</button>
          </span>
        ))}

        {/* Live input */}
        <div className="lf-tag-input-wrap">
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={draft}
            onChange={e => { setDraft(e.target.value); setShowDrop(true) }}
            onKeyDown={handleKey}
            onFocus={() => setShowDrop(true)}
            onBlur={() => {
              setTimeout(() => {
                if (draft.trim()) addTag(draft)
                setShowDrop(false)
              }, 160)
            }}
            placeholder={tags.length ? '' : placeholder}
            className="lf-tag-input"
            disabled={disabled}
            autoComplete="off"
          />

          {/* Dropdown */}
          {showDrop && suggestions.length > 0 && (
            <div className="lf-suggestions">
              {suggestions.map(s => (
                <div
                  key={s}
                  className="lf-suggestion-item"
                  onMouseDown={() => { addTag(s) }}
                >
                  <span className="lf-sug-icon">{icon}</span>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Count hint */}
      {tags.length > 0 && (
        <div className="lf-tags-count">
          {tags.length} {tags.length === 1 ? 'value' : 'values'} added
          <button type="button" className="lf-clear-all" onClick={() => setTags([])}>Clear all</button>
        </div>
      )}

      {/* Quick chips */}
      <div className="lf-chips">
        {quickList.map(chip => {
          const active = tags.map(t => t.toLowerCase()).includes(chip.toLowerCase())
          return (
            <button
              type="button"
              key={chip}
              className={`lf-chip ${active ? 'lf-chip-active' : ''}`}
              onClick={() => toggleQuick(chip)}
              disabled={disabled}
            >
              {active ? '✓ ' : '+ '}{chip}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────── */
export default function LeadForm() {
  const [icpTags,  setIcpTags]  = useState([])
  const [locTags,  setLocTags]  = useState([])
  const [status,   setStatus]   = useState('idle')   // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const icpStr = icpTags.join(', ')
  const locStr = locTags.join(', ')

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!icpTags.length || !locTags.length) return

  //   setStatus('loading')
  //   setErrorMsg('')

  //   try {
  //     const res = await fetch(WEBHOOK_URL, {
  //       method:  'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         ICP:      icpStr,
  //         Location: locStr,
  //       }),
  //     })
  //     if (!res.ok) throw new Error(`Server responded with ${res.status}`)
  //     setStatus('success')
  //   } catch (err) {
  //     console.error(err)
  //     setErrorMsg(err.message || 'Something went wrong. Please try again.')
  //     setStatus('error')
  //   }
  // }


    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!icpTags.length || !locTags.length) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ICP: icpStr,
          Location: locStr,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // 🔥 CRITICAL PART
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.xlsx'; // file name (Renaming the file and then downloading...)
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setIcpTags([])
    setLocTags([])
    setStatus('idle')
    setErrorMsg('')
  }

  const canSubmit = icpTags.length > 0 && locTags.length > 0 && status !== 'loading'
  const showPreview = icpTags.length > 0 || locTags.length > 0

  return (
    <div className="lf-page">

      {/* ── NAV ── */}
      <nav className="lf-nav">
        <div className="lf-nav-brand">
          <img
            src={MOTM_LOGO}
            alt="MOTM Technologies"
            className="lf-logo-img"
            width="48"
            height="48"
          />
          <div>
            <div className="lf-brand-name">MOTM Technologies</div>
            <div className="lf-brand-tag">Igniting Industrial Growth</div>
          </div>
        </div>
        <a href="https://www.motm.tech/" target="_blank" rel="noopener noreferrer" className="lf-nav-link">
          motm.tech ↗
        </a>
      </nav>

      {/* ── MAIN ── */}
      <main className="lf-main">

        {/* LEFT PANEL */}
        <div className="lf-left">
          <div className="lf-left-inner">

            {/* <div className="lf-left-logo-wrap">
              <img src={MOTM_LOGO} alt="MOTM Technologies" className="lf-left-logo" />
            </div> */}

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
              Tell us your Ideal Customer Profiles and target locations. Our intelligent pipeline will discover, enrich, and deliver qualified B2B leads directly to you.
            </p>

            <div className="lf-features">
              {[
                // { icon: '🎯', title: 'Multi-ICP Targeting',   desc: 'Target multiple sectors in a single pipeline run' },
                // { icon: '📍', title: 'Multi-City Discovery',  desc: 'Hyper-local lead discovery across Indian markets'  },
                // { icon: '⚡', title: 'Auto Pipeline',         desc: 'n8n-powered 3-agent enrichment & outreach flow'   },
                { icon: '🎯', title: 'ICP Targeting',   desc: 'Precision targeting for engineering & industrial sectors' },
                { icon: '📍', title: 'Location Mapping', desc: 'Map-based lead discovery across Indian markets'         },
                { icon: '⚡', title: 'Auto Pipeline',    desc: 'n8n-powered AI-agent enrichment & outreach flow'          },
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
              {[['B2B', 'Focused'], ['SME', 'Specialist'], ['n8n', 'Powered']].map(([n, l], i) => (
                <div className="lf-stat" key={i}>
                  <span className="lf-stat-num">{n}</span>
                  <span className="lf-stat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lf-blob lf-blob-1" aria-hidden="true" />
          <div className="lf-blob lf-blob-2" aria-hidden="true" />
          <div className="lf-blob lf-blob-3" aria-hidden="true" />
        </div>

        {/* RIGHT PANEL */}
        <div className="lf-right">
          <div className="lf-form-card">

            {status === 'success' ? (
              /* ── SUCCESS STATE ── */
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
                  {/* Your lead generation request has been sent to the n8n pipeline. The lead excel file downloaded successfully  */}
                  Your lead generation request has been successfully processed. The Excel file containing your leads has been downloaded.
                </p>

                <div className="lf-success-detail">
                  <div className="lf-success-row">
                    <span className="lf-success-key">ICP</span>
                    <div className="lf-success-tags">
                      {icpTags.map(t => <span key={t} className="lf-success-tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-key">Location</span>
                    <div className="lf-success-tags">
                      {locTags.map(t => <span key={t} className="lf-success-tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-key">Status</span>
                    <span className="lf-success-val lf-green">✓ Submitted to n8n</span>
                  </div>
                </div>

                <button className="lf-btn-secondary" onClick={handleReset}>
                  Submit another request
                </button>
              </div>
            ) : (
              /* ── FORM STATE ── */
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
                    <p className="lf-form-subtitle">Enter details to start the pipeline — multiple values supported</p>
                  </div>
                </div>

                <div className="lf-divider" />

                <form onSubmit={handleSubmit} className="lf-form" noValidate>

                  <TagInput
                    id="icp" // IDEAL CUSTOMER PROFILE
                    tags={icpTags}
                    setTags={setIcpTags}
                    pool={ICP_POOL}
                    quickList={ICP_QUICK}
                    placeholder="chemical, pharmaceutical, tool manufacturer…"
                    icon="🎯"
                    disabled={status === 'loading'}
                  />

                  <TagInput
                    id="location" //TARGET LOCATION
                    tags={locTags}
                    setTags={setLocTags}
                    pool={LOC_POOL}
                    quickList={LOC_QUICK}
                    placeholder="pune, mumbai, delhi…"
                    icon="📍"
                    disabled={status === 'loading'}
                  />

                  {/* Error */}
                  {status === 'error' && (
                    <div className="lf-error-box">
                      <span>⚠</span> {errorMsg}
                    </div>
                  )}

                  {/* Live payload preview */}
                  {showPreview && (
                    <div className="lf-payload-preview">
                      <div className="lf-payload-topbar">
                        <div className="lf-payload-dots">
                          <span className="pd t-red"/>
                          <span className="pd t-yellow"/>
                          <span className="pd t-green"/>
                        </div>
                        <span className="lf-payload-label">POST payload preview</span>
                        <span className="lf-payload-method">application/json</span>
                      </div>
                      <pre className="lf-payload-code">
{JSON.stringify({
  ICP:      icpTags.length ? icpStr : '…',
  Location: locTags.length ? locStr : '…',
}, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`lf-submit-btn ${status === 'loading' ? 'lf-btn-loading' : ''}`}
                    disabled={!canSubmit}
                  >
                    {status === 'loading' ? (
                      <><span className="lf-spinner" />Sending to Pipeline…</>
                    ) : (
                      <>
                        <span className="lf-btn-play">▶</span>
                        Start Lead Generation
                        <span className="lf-btn-arrow">→</span>
                      </>
                    )}
                  </button>

                  <p className="lf-form-note">
                    Sends a POST request to the n8n automation webhook. Both fields are required.
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
