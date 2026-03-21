# Connect Agent Workflow to n8n

## 1. Create 3 workflows in n8n

Create three workflows, each with a **Webhook** trigger node.

### Workflow 1 – Agent 1
- **Trigger:** Webhook (POST)
- **Path:** e.g. `agent1` or `agent-workflow-1`
- **Receives:** `{ companyName, fileName, fileBase64 }`
- **Returns:** `{ output: "your result text" }` (use Respond to Webhook node)

### Workflow 2 – Agent 2
- **Trigger:** Webhook (POST)
- **Path:** e.g. `agent2` or `agent-workflow-2`
- **Receives:** `{ companyName, agent1Output }`
- **Returns:** `{ output: "your result text" }`

### Workflow 3 – Agent 3
- **Trigger:** Webhook (POST)
- **Path:** e.g. `agent3` or `agent-workflow-3`
- **Receives:** `{ companyName, agent2Output, additionalInstructions }`
- **Returns:** `{ output: "your result text" }`

## 2. Activate workflows

Activate each workflow in n8n so you get production webhook URLs.

Production URLs look like:
`https://your-n8n-instance.com/webhook/agent1`

## 3. Configure the React app

### Option A: Environment variables (recommended)

Create `.env` in the project root:

```env
VITE_N8N_AGENT1_URL=https://your-n8n.com/webhook/agent1
VITE_N8N_AGENT2_URL=https://your-n8n.com/webhook/agent2
VITE_N8N_AGENT3_URL=https://your-n8n.com/webhook/agent3
```

Restart the dev server after changing `.env`.

### Option B: Edit `src/n8n-config.js`

Set the URLs directly:

```js
agent1Url: 'https://your-n8n.com/webhook/agent1',
agent2Url: 'https://your-n8n.com/webhook/agent2',
agent3Url: 'https://your-n8n.com/webhook/agent3',
```

## 4. CORS (if n8n is on a different domain)

If your n8n instance is on another domain, enable  for your webhook URLs in n8n settings, or use a reverse proxy.

## 5. Fallback behavior

- If no URLs are set, the app runs in **simulation mode** (fake delays).
- If a webhook fails, the app falls back to simulation for that agent and shows an error.

## n8n response format

Your workflows should return JSON with an `output` field, for example:

```json
{
  "output": "[Agent 1] Processed input for Acme Corp. File: data.xlsx. Analysis complete."
}
```

Or use the **Respond to Webhook** node and set the response body to include `output`.
