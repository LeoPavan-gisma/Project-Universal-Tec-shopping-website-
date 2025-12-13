import { useState } from 'react'
import { generateJannuReply } from '../utils/jannuBot'

const starterMessages = [
    { from: 'bot', text: "Hi, I'm Jannu — your AI tech assistant. Ask me about products, orders, or troubleshooting." }
]

const quickPrompts = [
    'Suggest a laptop for AI development under €1800',
    'What robots do you have for kids?',
    'Track my recent order status',
    'Create a smart home starter bundle for €400',
    'Which monitor pairs well with a MacBook?' 
]

export default function AiAssistant() {
    const [messages, setMessages] = useState(starterMessages)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async (textOverride) => {
        const text = (textOverride ?? input).trim()
        if (!text) return

        const userMessage = { from: 'user', text }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, persona: 'jannu', tone: 'helpful tech guide' })
            })

            if (res.ok) {
                const data = await res.json()
                const reply = data.reply || data.message || 'I am here to help with anything in the shop.'
                setMessages(prev => [...prev, { from: 'bot', text: reply }])
                setLoading(false)
                return
            }
        } catch (err) {
            // ignore and fall back
        }

        let cart = []
        try {
            cart = JSON.parse(localStorage.getItem('cart') || '[]')
        } catch (e) {
            cart = []
        }

        const reply = generateJannuReply(text, { cart })

        setMessages(prev => [...prev, { from: 'bot', text: reply }])
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid gap-8 lg:grid-cols-2 items-start">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold shadow-sm">
                            <span>🤖</span>
                            <span>Meet Jannu — AI Tech Assistant</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Smart guidance for every purchase and order</h1>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Jannu answers questions about products, builds bundles for your budget, and helps you move from cart to checkout without friction.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                                <div className="text-2xl mb-2">⚡</div>
                                <h3 className="font-semibold">Instant product picks</h3>
                                <p className="text-sm text-gray-600">Ask for recommendations by budget, brand, or category and get a shortlist fast.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                                <div className="text-2xl mb-2">📦</div>
                                <h3 className="font-semibold">Order + support</h3>
                                <p className="text-sm text-gray-600">Track orders, learn return steps, and get payment guidance in one place.</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Try a quick prompt</h4>
                            <div className="flex flex-wrap gap-2">
                                {quickPrompts.map(prompt => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium shadow-sm transition"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-blue-600 text-white flex items-center justify-between">
                            <div>
                                <div className="text-sm uppercase tracking-wide opacity-80">AI chat</div>
                                <div className="text-xl font-semibold">Jannu is online</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-2xl">💬</div>
                        </div>
                        <div className="p-5 h-[420px] overflow-y-auto space-y-3 bg-gray-50">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} px-4 py-3 rounded-2xl shadow-sm max-w-[80%] text-sm leading-relaxed`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="text-left text-sm text-gray-500">Jannu is typing…</div>
                            )}
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    placeholder="Ask Jannu about tech or orders..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                                >
                                    Send
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Jannu replies live when the backend AI is reachable, with a product-aware fallback that works offline.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
