const express = require('express')
const router = express.Router()

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { message } = req.body || {}
  if (!message) return res.status(400).json({ error: 'message required' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // fallback canned replies
    const lower = (message || '').toLowerCase()
    let reply = "Hi — I'm the Universal Tech Shop assistant. I can help with products, orders, and payments."
    if (lower.includes('price') || lower.includes('cost')) reply = 'Prices vary — please check the product page for current pricing.'
    if (lower.includes('shipping')) reply = 'We offer international shipping; delivery times depend on your location.'
    return res.json({ reply })
  }

  try {
    // Use global fetch (Node 18+) to call OpenAI
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 400
      })
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return res.status(502).json({ error: 'AI provider error', detail: txt })
    }

    const data = await resp.json()
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, no reply.'
    return res.json({ reply })
  } catch (err) {
    console.error('AI proxy error', err)
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
