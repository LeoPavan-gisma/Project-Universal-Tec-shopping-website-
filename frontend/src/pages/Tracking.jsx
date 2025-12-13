import React, { useEffect, useState } from 'react'

// Simple inline map using Google Maps Embed API
const MapEmbed = ({ address }) => {
  if (!address) return null
  const encoded = encodeURIComponent(address)
  return (
    <iframe
      width="100%"
      height="300"
      className="rounded border mt-2"
      src={`https://maps.google.com/maps?q=${encoded}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
    />
  )
}

// Simple mock tracking lookup; replace with real API call when available.
const mockOrders = [
  { id: 'ORD-1001', name: 'Premium Ultrabook', address: '123 Main St', status: 'Shipped', eta: '3-5 days' },
  { id: 'ORD-1002', name: 'Wireless Earbuds', address: '456 Elm Ave', status: 'Out for delivery', eta: 'Today' },
  { id: 'ORD-1003', name: 'Gaming Laptop RTX', address: '789 Market Rd', status: 'Processing', eta: 'Pending' },
]

export default function Tracking() {
  const [orderId, setOrderId] = useState('')
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [localOrders, setLocalOrders] = useState([])

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    setLocalOrders(orders)
  }, [])

  const lookup = () => {
    if (!orderId || !address) {
      setStatus('Enter order ID and address to track.')
      setResult(null)
      return
    }
    // Try local orders first
    const localHit = localOrders.find(o => o.id.toLowerCase() === orderId.toLowerCase())
    if (localHit) {
      if (!localHit.address || localHit.address.toLowerCase() === address.toLowerCase()) {
        setResult(localHit)
        setStatus('')
        return
      }
      setStatus('Address does not match this order.')
      setResult(null)
      return
    }

    // Try mock list next
    const hit = mockOrders.find(o => o.id.toLowerCase() === orderId.toLowerCase())
    if (hit) {
      if (hit.address.toLowerCase() === address.toLowerCase()) {
        setResult(hit)
        setStatus('')
        return
      }
      setStatus('Address does not match this order.')
      setResult(null)
      return
    }
    // If no mock found, create a friendly placeholder
    setResult({ id: orderId, name: 'Order', status: 'Processing', eta: 'TBD', address })
    setStatus('This is a placeholder until live tracking is connected.')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-white/90 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
      <label className="block text-sm font-semibold mb-1">Order ID</label>
      <input value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="e.g., ORD-1001" />

      <label className="block text-sm font-semibold mt-3 mb-1">Shipping Address</label>
      <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="Street, City" />

      <button onClick={lookup} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Track</button>

      {status && <p className="mt-3 text-sm text-blue-700">{status}</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <p className="font-semibold">Order: {result.id}</p>
          <p className="text-sm">Item: {result.name}</p>
          <p className="text-sm">Address: {result.address}</p>
          <p className="text-sm">Status: {result.status}</p>
          <p className="text-sm">ETA: {result.eta}</p>
          <MapEmbed address={result.address} />
        </div>
      )}
    </div>
  )
}
