/**
 * n8n API helpers – call your n8n webhook workflows
 */

import { N8N_CONFIG } from '../n8n-config'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result?.split(',')[1]
      resolve(base64 || '')
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function hasN8nUrls() {
  return N8N_CONFIG.agent1Url && N8N_CONFIG.agent2Url && N8N_CONFIG.agent3Url
}

export async function callAgent1(companyName, file, fileName) {
  if (!hasN8nUrls()) return null
  if(!companyName)
    console.log("false")
  if(!file)
    console.log("false")
  const fileBase64 = file ? await fileToBase64(file) : ''
  const res = await fetch(N8N_CONFIG.agent1Url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent: 1,
      companyName,
      fileName,
      fileBase64,
    }),
  })

  if (!res.ok) throw new Error(`Agent 1 failed: ${res.status}`)
  const data = await res.json().catch(() => ({}))
  const output = data?.output ?? data?.result ?? data?.data ?? data?.body?.output ?? data?.body
  return typeof output === 'string' ? output : JSON.stringify(output ?? data)
}

// export async function callAgent2(companyName, agent1Output) {
//   if (!hasN8nUrls()) return null

//   const res = await fetch(N8N_CONFIG.agent2Url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       agent: 2,
//       companyName,
//       agent1Output,
//     }),
//   })

//   if (!res.ok) throw new Error(`Agent 2 failed: ${res.status}`)
//   const data = await res.json().catch(() => ({}))
//   const output = data?.output ?? data?.result ?? data?.data ?? data?.body?.output ?? data?.body
//   return typeof output === 'string' ? output : JSON.stringify(output ?? data)
// }

// export async function callAgent3(companyName, agent2Output, additionalInstructions) {
//   if (!hasN8nUrls()) return null

//   const res = await fetch(N8N_CONFIG.agent3Url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       agent: 3,
//       companyName,
//       agent2Output,
//       additionalInstructions: additionalInstructions || '',
//     }),
//   })

//   if (!res.ok) throw new Error(`Agent 3 failed: ${res.status}`)
//   const data = await res.json().catch(() => ({}))
//   const output = data?.output ?? data?.result ?? data?.data ?? data?.body?.output ?? data?.body
//   return typeof output === 'string' ? output : JSON.stringify(output ?? data)
// }

// export { hasN8nUrls }
