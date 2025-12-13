const express = require('express')
const router = express.Router()

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  const stripeSecret = process.env.STRIPE_SECRET
  if (!stripeSecret) {
    return res.status(200).json({
      ready: false,
      message: 'Stripe not configured. Set STRIPE_SECRET on backend and VITE_STRIPE_PK on frontend.',
    })
  }

  const Stripe = require('stripe')
  const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

  try {
    // Expect items: [{ price, quantity }] or fallback to a test item
    const { items } = req.body || {}
    const line_items = (items && items.length) ? items : [{ price_data: { currency: 'usd', product_data: { name: 'Demo Item' }, unit_amount: 500 }, quantity: 1 }]

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${frontend}/order-success?orderId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend}/checkout?canceled=true`
    })

    res.json({ ready: true, id: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe error', err)
    res.status(500).json({ error: 'stripe error' })
  }
})

module.exports = router
