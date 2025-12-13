import React, { useState } from 'react'
import { generateJannuReply } from '../utils/jannuBot'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi — I'm Jannu, your AI tech assistant. Ask me about products, orders, or payments." }
  ])
  const [input, setInput] = useState('')
  const clearHistory = () => {
    setMessages([
      { from: 'bot', text: "Hi — I'm Jannu, your AI tech assistant. Ask me about products, orders, or payments." }
    ])
  }

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setInput('')

    // Try backend AI proxy first
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, persona: 'jannu', tone: 'helpful tech guide' })
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(m => [...m, { from: 'bot', text: data.reply || 'Sorry, no reply.' }])
        return
      }
    } catch (err) {
      // fallthrough to client fallback
    }

    // Client-side fallback simple bot
    let cart = []
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]')
    } catch (e) {
      cart = []
    }

    const reply = generateJannuReply(input, { cart })

    setMessages(m => [...m, { from: 'bot', text: reply }])
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {open ? (
        <div className="w-80 max-w-xs bg-white/95 text-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-2 bg-blue-600 text-white flex justify-between items-center">
            <div className="font-semibold">Jannu · AI chat</div>
            <div className="flex gap-2">
              <button onClick={clearHistory} className="text-sm opacity-80 hover:opacity-100">Clear</button>
              <button onClick={() => setOpen(false)} className="text-sm opacity-80 hover:opacity-100">Close</button>
            </div>
          </div>
          <div className="p-3 h-56 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'bot' ? 'text-sm text-left' : 'text-sm text-right'}>
                <div className={`inline-block px-3 py-2 rounded ${m.from === 'bot' ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 px-3 py-2 rounded border" placeholder="Ask me anything..." />
              <button onClick={send} className="px-3 py-2 bg-green-500 text-white rounded">Send</button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg">🤖</button>
      )}
    </div>
  )
}
