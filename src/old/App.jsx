import { useState, useRef } from 'react'
import './App.css'
// import { callAgent1, callAgent2, callAgent3, hasN8nUrls } from './api/n8n'

function App() {
  const [companyName, setCompanyName] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [agent1Output, setAgent1Output] = useState('')
  const [agent2Output, setAgent2Output] = useState('')
  const [agent3Output, setAgent3Output] = useState('')
  const [agent1Status, setAgent1Status] = useState('idle') // idle | running | done
  const [agent2Status, setAgent2Status] = useState('idle')
  const [agent3Status, setAgent3Status] = useState('idle')
  const [showModal, setShowModal] = useState(false)
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setFileName(f.name)
    }
  }

  // const simulateAgent1 = () => {
  //   setAgent1Status('running')
  //   setAgent1Output('Agent 1 is processing...')
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       setAgent1Output(`[Agent 1] Processed input for "${companyName}". File: ${fileName}. Analysis complete.`)
  //       setAgent1Status('done')
  //       resolve()
  //     }, 2000)
  //   })
  // }

  // const simulateAgent2 = () => {
  //   setAgent2Status('running')
  //   setAgent2Output('Agent 2 is processing...')
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       setAgent2Output(`[Agent 2] Refined results for "${companyName}". Secondary analysis done.`)
  //       setAgent2Status('done')
  //       resolve()
  //     }, 2500)
  //   })
  // }

  // const simulateAgent3 = (instructions) => {
  //   setAgent3Status('running')
  //   setAgent3Output('Agent 3 is processing...')
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const instr = instructions?.trim() ? `\nAdditional instructions applied: "${instructions}"` : ''
  //       setAgent3Output(`[Agent 3] Final output for "${companyName}".${instr}\n\nAll agents completed successfully.`)
  //       setAgent3Status('done')
  //       resolve()
  //     }, 2000)
  //   })
  // }

  // const runAgent1 = async () => {
  //   setAgent1Status('running')
  //   setAgent1Output('Agent 1 is processing...')
  //   try {
  //     if (hasN8nUrls()) {
  //       const output = await callAgent1(companyName, file, fileName)
  //       setAgent1Output(output || '[Agent 1] No output returned.')
  //     } else {
  //       await simulateAgent1()
  //       return
  //     }
  //   } catch (err) {
  //     setAgent1Output(`[Agent 1] Error: ${err.message}. Falling back to simulation.`)
  //     await simulateAgent1()
  //     return
  //   }
  //   setAgent1Status('done')
  // }

  // const runAgent2 = async () => {
  //   setAgent2Status('running')
  //   setAgent2Output('Agent 2 is processing...')
  //   try {
  //     if (hasN8nUrls()) {
  //       const output = await callAgent2(companyName, agent1Output)
  //       setAgent2Output(output || '[Agent 2] No output returned.')
  //     } else {
  //       await simulateAgent2()
  //       return
  //     }
  //   } catch (err) {
  //     setAgent2Output(`[Agent 2] Error: ${err.message}. Falling back to simulation.`)
  //     await simulateAgent2()
  //     return
  //   }
  //   setAgent2Status('done')
  // }

  // const runAgent3 = async (instructions) => {
  //   setAgent3Status('running')
  //   setAgent3Output('Agent 3 is processing...')
  //   try {
  //     if (hasN8nUrls()) {
  //       const output = await callAgent3(companyName, agent2Output, instructions)
  //       setAgent3Output(output || '[Agent 3] No output returned.')
  //     } else {
  //       await simulateAgent3(instructions)
  //       return
  //     }
  //   } catch (err) {
  //     setAgent3Output(`[Agent 3] Error: ${err.message}. Falling back to simulation.`)
  //     await simulateAgent3(instructions)
  //     return
  //   }
  //   setAgent3Status('done')
  // }

  // const handleStart = async () => {
  //   if (!companyName.trim() || !file) return
  //   setIsRunning(true)
  //   setAgent1Output('')
  //   setAgent2Output('')
  //   setAgent3Output('')
  //   setAgent1Status('idle')
  //   setAgent2Status('idle')
  //   setAgent3Status('idle')
  //   setAdditionalInstructions('')
  //   setShowModal(false)

  //   await runAgent1()
  //   await runAgent2()
  //   setShowModal(true)
  // }

  const handleStart = async () => {
  if (!companyName.trim() || !file) return

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

    alert('File sent successfully ✅')
  } catch (err) {
    console.error(err)
    alert('Upload failed ❌')
  }
}

  const handleModalSubmit = async () => {
    setShowModal(false)
    await runAgent3(additionalInstructions)
    setIsRunning(false)
  }

  const handleModalCancel = () => {
    setShowModal(false)
    setAdditionalInstructions('')
    setAgent3Output('[Agent 3] Skipped — no additional instructions provided.')
    setAgent3Status('done')
    setIsRunning(false)
  }

  // const isN8nConnected = hasN8nUrls()

  const canStart = companyName.trim() && file && !isRunning && !showModal

  return (
    <div className="app">
      <header className="header">
        <h1>MOTM's Intelligent Engine</h1>
        <p className="subtitle">
          {/* Company name, input file, and three-agent pipeline */}
          {/* {isN8nConnected && <span className="n8n-badge"> connected to n8n</span>} */}
        </p>
      </header>

      <section className="input-section">
        <div className="field">
          <label htmlFor="company">Company name</label>
          <input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            disabled={isRunning}
          />
        </div>
        <div className="field">
          <label>Input file</label>
          <div className="file-row">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={isRunning}
              className="file-input"
            />
            <span className="file-name">{fileName || 'No file chosen'}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isRunning}
              className="btn-secondary"
            >
              Choose file
            </button>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={!canStart}
        >
          Start workflow
        </button>
      </section>

      {/* <section className="output-section">
        <div className={`agent-card ${agent1Status}`}>
          <div className="agent-header">
            <h3>Agent One</h3>
            <span className="status-badge">{agent1Status}</span>
          </div>
          <pre className="output">{agent1Output || '—'}</pre>
        </div>
         <div className={`agent-card ${agent2Status}`}>
          <div className="agent-header">
            <h3>Agent Two</h3>
            <span className="status-badge">{agent2Status}</span>
          </div>
          <pre className="output">{agent2Output || '—'}</pre>
        </div>
        <div className={`agent-card ${agent3Status}`}>
          <div className="agent-header">
            <h3>Agent Three</h3>
            <span className="status-badge">{agent3Status}</span>
          </div>
          <pre className="output">{agent3Output || '—'}</pre>
        </div> 
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => {}}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Additional instructions</h3>
            <p className="modal-desc">Agent Two has finished. Add any instructions for Agent Three before it runs.</p>
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Enter additional instructions for Agent 3..."
              rows={4}
              autoFocus
            />
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleModalCancel}>
                Skip
              </button>
              <button type="button" className="btn-primary" onClick={handleModalSubmit}>
                Run Agent 3
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default App

