import React, { useState, useEffect } from 'react'
import { login } from '../utils/api'
import { useNavigate, Link } from 'react-router-dom'
import BiometricAuth, { registerBiometric } from '../components/BiometricAuth'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [showBiometric, setShowBiometric] = useState(false)
    const [biometricAvailable, setBiometricAvailable] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('securityLocked')) {
            setStatus('Session locked after inactivity. Please login again.')
            localStorage.removeItem('securityLocked')
        }

        // Check if biometric is available on device (show button even without registration)
        const checkBiometric = async () => {
            try {
                if (window.PublicKeyCredential) {
                    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                    setBiometricAvailable(available) // Show button if device supports it
                }
            } catch (e) {
                setBiometricAvailable(false)
            }
        }
        checkBiometric()
    }, [])

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus('')

        const res = await login({ email, password })

        if (res.token) {
            localStorage.setItem('token', res.token)
            localStorage.setItem('user', JSON.stringify(res.user))
            setStatus('Login successful! Redirecting...')
            
            // Try to register biometric if enabled in settings and not already registered
            const securitySettings = JSON.parse(localStorage.getItem('securitySettings') || '{}')
            if (securitySettings.fingerprintEnabled && !localStorage.getItem('biometricCredentialId')) {
                const biometricResult = await registerBiometric(email)
                if (biometricResult.success) {
                    setStatus('Login successful! Biometric registered. Redirecting...')
                }
            }
            
            setTimeout(() => navigate('/'), 1000)
        } else {
            setStatus(res.message || 'Login failed')
        }
        setLoading(false)
    }

    const handleBiometricSuccess = () => {
        const savedEmail = localStorage.getItem('biometricEmail')
        if (savedEmail) {
            // Generate mock token for demo
            const mockToken = 'biometric-' + Date.now()
            localStorage.setItem('token', mockToken)
            localStorage.setItem('user', JSON.stringify({ email: savedEmail, name: savedEmail.split('@')[0] }))
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-10 border-2 border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">🔐 Welcome Back</h1>
                    <p className="text-lg text-gray-600 font-medium">Login to your Universal Tech Shop account</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">📧 Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">🔒 Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {status && (
                        <div className={`p-4 rounded-lg text-base font-semibold border-2 ${status.includes('successful') ? 'bg-green-100 text-green-800 border-green-500' : 'bg-red-100 text-red-800 border-red-500'}`}>
                            {status}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition shadow-lg"
                    >
                        {loading ? '⏳ Logging in...' : '✓ Login'}
                    </button>
                </form>

                {/* Biometric Login Option */}
                {biometricAvailable && (
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-base">
                                <span className="px-4 bg-white text-gray-600 font-semibold">Or use</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowBiometric(true)}
                            className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-bold text-base transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl">🔐</span>
                            <span>Biometric Login</span>
                        </button>
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <Link 
                            to="/password-reset"
                            className="text-base text-blue-600 hover:text-blue-700 font-bold hover:underline"
                        >
                            🔑 Forgot your password?
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-base">
                            <span className="px-4 bg-white text-gray-600 font-semibold">Don't have an account?</span>
                        </div>
                    </div>

                    <Link
                        to="/register"
                        className="block w-full px-4 py-3 text-center bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-bold text-base transition border-2 border-green-300"
                    >
                        ➕ Create an Account
                    </Link>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-5 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <p className="text-sm text-blue-900 font-bold mb-3">🎯 Demo Credentials:</p>
                    <div className="space-y-2 text-sm text-blue-800 font-semibold">
                        <p>
                            <span className="inline-block w-20 font-bold text-blue-900">Admin:</span> 
                            <span className="bg-blue-100 px-2 py-1 rounded">admin@dev</span> / 
                            <span className="bg-blue-100 px-2 py-1 rounded">password</span>
                        </p>
                        <p>
                            <span className="inline-block w-20 font-bold text-blue-900">User:</span> 
                            <span className="bg-blue-100 px-2 py-1 rounded">user@dev</span> / 
                            <span className="bg-blue-100 px-2 py-1 rounded">password</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Biometric Auth Modal */}
            {showBiometric && (
                <BiometricAuth
                    onSuccess={handleBiometricSuccess}
                    onCancel={() => setShowBiometric(false)}
                />
            )}
        </div>
    )
}
