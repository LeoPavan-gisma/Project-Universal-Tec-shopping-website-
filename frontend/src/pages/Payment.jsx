import React from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || '')

export default function Payment() {
  const handleCheckout = async () => {
    const stripe = await stripePromise
    if (!stripe) {
      alert('Stripe not configured. Set VITE_STRIPE_PK in .env')
      return
    }

    // This is a stub: in production you should create a Checkout Session on the server
    alert('This demo uses a stubbed Stripe flow. Implement server Checkout Session.')
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>
      <p className="mb-4">Use Stripe Checkout for payments. Configure `VITE_STRIPE_PK` in your frontend environment.</p>
      <button onClick={handleCheckout} className="px-5 py-3 bg-green-500 text-white rounded">Pay (Demo)</button>
    </div>
  )
}
