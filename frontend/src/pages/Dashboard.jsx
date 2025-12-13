import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('orders') // 'orders', 'profile', 'password'
    const [orders, setOrders] = useState([])
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
    const [editProfile, setEditProfile] = useState(false)
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' })
    const [status, setStatus] = useState('')
    const [securityStatus, setSecurityStatus] = useState('')
    const [security, setSecurity] = useState({
        quickLockEnabled: false,
        lockMinutes: 2,
        fingerprintEnabled: false,
        deviceSupport: 'checking'
    })
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('token')
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

    // Fetch orders from localStorage (fallback) or backend
    const fetchOrders = async () => {
        try {
            if (token) {
                const res = await fetch(`${apiUrl}/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setOrders(Array.isArray(data) ? data : [])
                    return
                }
            }
        } catch (err) {
            console.log('Backend orders fetch failed, using localStorage:', err.message)
        }

        // Fallback: use localStorage orders
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        setOrders(localOrders)
    }

    // Fetch user profile from token or localStorage
    const fetchProfile = async () => {
        try {
            // Try to decode JWT token for user info
            if (token) {
                const parts = token.split('.')
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]))
                    setProfile({
                        name: payload.name || 'User',
                        email: payload.email || 'user@example.com',
                        phone: payload.phone || ''
                    })
                    return
                }
            }
        } catch (err) {
            console.log('Token decode failed:', err.message)
        }

        // Fallback: use localStorage data
        const stored = JSON.parse(localStorage.getItem('userProfile') || '{}')
        setProfile(stored.name ? stored : { name: 'User', email: 'user@example.com', phone: '' })
    }

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        fetchOrders()
        fetchProfile()
    }, [token, navigate])

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('securitySettings') || '{}')
            setSecurity(prev => ({ ...prev, ...saved }))
        } catch (e) {
            // ignore parse errors
        }

        const detectPlatformAuth = async () => {
            try {
                if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
                    const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                    setSecurity(prev => ({ ...prev, deviceSupport: supported ? 'supported' : 'not-available' }))
                } else {
                    setSecurity(prev => ({ ...prev, deviceSupport: 'not-available' }))
                }
            } catch (err) {
                setSecurity(prev => ({ ...prev, deviceSupport: 'error' }))
            }
        }

        detectPlatformAuth()
    }, [])

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus('')

        try {
            // Try backend update
            const res = await fetch(`${apiUrl}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            })

            if (res.ok) {
                setStatus('Profile updated successfully!')
                setEditProfile(false)
                // Save to localStorage as backup
                localStorage.setItem('userProfile', JSON.stringify(profile))
                setTimeout(() => setStatus(''), 3000)
                return
            }
        } catch (err) {
            console.log('Backend update failed, saving locally:', err.message)
        }

        // Fallback: save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile))
        setStatus('Profile updated (local storage)!')
        setEditProfile(false)
        setTimeout(() => setStatus(''), 3000)
        setLoading(false)
    }

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus('')

        if (password.new !== password.confirm) {
            setStatus('New passwords do not match!')
            setLoading(false)
            return
        }

        if (password.new.length < 6) {
            setStatus('Password must be at least 6 characters!')
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`${apiUrl}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: password.current,
                    newPassword: password.new
                })
            })

            if (res.ok) {
                setStatus('Password changed successfully!')
                setPassword({ current: '', new: '', confirm: '' })
                setTimeout(() => setStatus(''), 3000)
            } else {
                const error = await res.json()
                setStatus(error.message || 'Password change failed!')
            }
        } catch (err) {
            setStatus('Password change failed: ' + err.message)
        }

        setLoading(false)
    }

    const handleSaveSecurity = (e) => {
        e.preventDefault()
        localStorage.setItem('securitySettings', JSON.stringify(security))
        setSecurityStatus(`Security preferences saved. Quick lock will sign you out after ${security.lockMinutes} minute(s) of inactivity when enabled.`)
        setTimeout(() => setSecurityStatus(''), 3500)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome, {profile.name}!</h1>
                    <p className="text-gray-600">Manage your account, view orders, and update settings</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto bg-white rounded-lg shadow p-2">
                    {['orders', 'profile', 'password', 'security'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium whitespace-nowrap transition ${
                                tab === t
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t === 'orders' && '📦 Orders'}
                            {t === 'profile' && '👤 Profile'}
                            {t === 'password' && '🔒 Password'}
                            {t === 'security' && '🛡️ Security'}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Order History</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg mb-4">No orders yet</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="text-lg font-semibold text-green-600">€{(order.total || 0).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery Address</p>
                                                <p className="text-gray-900">{order.address || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Status</p>
                                                <p className={`font-semibold ${
                                                    order.status === 'Paid' || order.status === 'Paid (PayPal)' ? 'text-green-600' :
                                                    order.status === 'Processing' ? 'text-blue-600' :
                                                    'text-gray-600'
                                                }`}>
                                                    {order.status || 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                        {order.eta && (
                                            <div className="pt-4 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">Estimated Delivery</p>
                                                <p className="text-gray-900">{order.eta}</p>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => navigate(`/tracking?orderId=${order.id}&address=${encodeURIComponent(order.address)}`)}
                                            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {tab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                            {!editProfile && (
                                <button
                                    onClick={() => setEditProfile(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {editProfile ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(123) 456-7890"
                                    />
                                </div>

                                {status && (
                                    <div className={`p-4 rounded-lg ${status.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {status}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditProfile(false)}
                                        className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.phone || 'Not set'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Password Tab */}
                {tab === 'password' && (
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Change Password</h2>

                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={password.current}
                                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={password.new}
                                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={password.confirm}
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            {status && (
                                <div className={`p-4 rounded-lg ${status.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {status}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Password Requirements:</strong>
                                <br/>
                                • At least 6 characters long
                                <br/>
                                • Avoid using common passwords
                                <br/>
                                • Don't share your password with others
                            </p>
                        </div>
                    </div>
                )}

                {tab === 'security' && (
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Security Controls</h2>
                        <p className="text-gray-600 mb-6">Manage quick lock and fingerprint preferences. Quick lock signs you out after inactivity; fingerprint saves your preference when your device supports WebAuthn biometrics.</p>

                        {securityStatus && (
                            <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-medium">
                                {securityStatus}
                            </div>
                        )}

                        <form onSubmit={handleSaveSecurity} className="space-y-5 max-w-xl">
                            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                                <input
                                    id="quickLock"
                                    type="checkbox"
                                    checked={security.quickLockEnabled}
                                    onChange={(e) => setSecurity(prev => ({ ...prev, quickLockEnabled: e.target.checked }))}
                                    className="mt-1 h-5 w-5"
                                />
                                <div className="flex-1">
                                    <label htmlFor="quickLock" className="font-semibold text-gray-900">Short lock (auto sign-out)</label>
                                    <p className="text-sm text-gray-600">When enabled, idle sessions auto-lock and send you back to login. Works even if offline because it is stored locally.</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-sm text-gray-700">Lock after</span>
                                        <select
                                            value={security.lockMinutes}
                                            onChange={(e) => setSecurity(prev => ({ ...prev, lockMinutes: Number(e.target.value) }))}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            disabled={!security.quickLockEnabled}
                                        >
                                            {[1,2,5,10].map(m => (
                                                <option key={m} value={m}>{m} min</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                                <input
                                    id="fingerprint"
                                    type="checkbox"
                                    checked={security.fingerprintEnabled}
                                    onChange={(e) => setSecurity(prev => ({ ...prev, fingerprintEnabled: e.target.checked }))}
                                    className="mt-1 h-5 w-5"
                                    disabled={security.deviceSupport === 'not-available'}
                                />
                                <div className="flex-1">
                                    <label htmlFor="fingerprint" className="font-semibold text-gray-900">Fingerprint / platform auth preference</label>
                                    <p className="text-sm text-gray-600">If your device supports platform authentication (e.g., Windows Hello, Touch ID), we store your preference and will use the backend prompt when available.</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Device support: {security.deviceSupport === 'supported' && 'Supported on this device'}
                                        {security.deviceSupport === 'not-available' && 'Not available on this device'}
                                        {security.deviceSupport === 'checking' && 'Checking...'}
                                        {security.deviceSupport === 'error' && 'Error checking device support'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Save security settings
                            </button>

                            <p className="text-xs text-gray-500">These settings are stored locally. Quick lock removes your token after the idle window; fingerprint preference enables device-level prompts when supported.</p>
                        </form>
                    </div>
                )}

                {/* Logout Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('userProfile')
                            localStorage.removeItem('securityLocked')
                            navigate('/login')
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
