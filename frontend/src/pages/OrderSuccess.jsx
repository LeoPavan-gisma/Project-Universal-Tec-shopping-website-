import React, { useEffect, useState } from 'react'

export default function OrderSuccess() {
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('orderId') || params.get('session_id')
    const pending = JSON.parse(localStorage.getItem('pendingOrder') || 'null')

    if (orderId) {
      // If we have a pending order saved locally, promote it to orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      let found = orders.find(o => o.id === orderId)
      if (!found && pending && (pending.id === orderId || !pending.id)) {
        found = { ...pending, id: orderId, status: 'Paid / Preparing' }
        orders.push(found)
        localStorage.setItem('orders', JSON.stringify(orders))
        localStorage.removeItem('pendingOrder')
      }
      setOrder(found || { id: orderId, status: 'Paid', name: pending?.name })
      setMessage('Payment confirmed. We are preparing your order.')
    } else {
      setMessage('Order confirmed (mock).')
    }

    // Clear cart
    localStorage.setItem('cart', '[]')
  }, [])

  return (
    <div className="p-6 max-w-xl mx-auto bg-white/90 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Order Confirmation</h2>
      {message && <p className="mb-3 text-green-700">{message}</p>}
      {order ? (
        <div className="text-sm space-y-1">
          <p><span className="font-semibold">Order ID:</span> {order.id}</p>
          {order.name && <p><span className="font-semibold">Name:</span> {order.name}</p>}
          {order.address && <p><span className="font-semibold">Address:</span> {order.address}</p>}
          {order.total && <p><span className="font-semibold">Total:</span> €{order.total.toFixed?.(2) || order.total}</p>}
          <p><span className="font-semibold">Status:</span> {order.status || 'Paid'}</p>
          <p className="text-gray-600 mt-2">You can track this order in the Tracking page using the Order ID.</p>
        </div>
      ) : (
        <p className="text-sm">We received your order.</p>
      )}
    </div>
  )
}
