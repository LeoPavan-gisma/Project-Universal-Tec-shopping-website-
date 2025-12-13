import { useState } from 'react'
import './BiometricAuth.css'

export default function BiometricAuth({ onSuccess, onCancel }) {
    const [state, setState] = useState('idle') // idle, scanning, success, error
    const [message, setMessage] = useState('Touch sensor to authenticate')

    const authenticate = async () => {
        setState('scanning')
        setMessage('Scanning...')

        try {
            // Check if WebAuthn is available
            if (!window.PublicKeyCredential) {
                setState('error')
                setMessage('Biometric auth not supported on this device')
                setTimeout(() => {
                    setState('idle')
                    setMessage('Touch sensor to authenticate')
                }, 2000)
                return
            }

            // Try to get existing credentials
            const storedCredentialId = localStorage.getItem('biometricCredentialId')
            
            if (!storedCredentialId) {
                // Auto-register if no credential exists
                setMessage('Setting up biometric login...')
                const email = 'demo@universaltech.shop' // Demo email for first-time setup
                const registrationResult = await registerBiometric(email)
                
                if (registrationResult.success) {
                    setMessage('Biometric registered! Authenticating...')
                    // Continue to authenticate with newly registered credential
                } else {
                    setState('error')
                    setMessage('Registration cancelled or failed')
                    setTimeout(() => {
                        setState('idle')
                        setMessage('Touch sensor to authenticate')
                    }, 2500)
                    return
                }
            }

            // Create authentication challenge
            const challenge = new Uint8Array(32)
            crypto.getRandomValues(challenge)

            // Get the credential ID (either existing or newly registered)
            const credentialId = localStorage.getItem('biometricCredentialId')

            const publicKeyCredentialRequestOptions = {
                challenge,
                allowCredentials: [{
                    id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
                    type: 'public-key',
                    transports: ['internal', 'usb', 'nfc', 'ble']
                }],
                timeout: 60000,
                userVerification: 'required'
            }

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            })

            if (assertion) {
                setState('success')
                setMessage('Authentication successful!')
                setTimeout(() => {
                    onSuccess()
                }, 1000)
            }
        } catch (error) {
            console.error('Biometric auth error:', error)
            setState('error')
            
            if (error.name === 'NotAllowedError') {
                setMessage('Authentication cancelled or failed')
            } else if (error.name === 'InvalidStateError') {
                setMessage('Device not configured for biometrics')
            } else {
                setMessage('Authentication failed. Try again.')
            }
            
            setTimeout(() => {
                setState('idle')
                setMessage('Touch sensor to authenticate')
            }, 2500)
        }
    }

    return (
        <div className="biometric-container">
            <div className="biometric-modal">
                <div className="biometric-header">
                    <h3>Biometric Authentication</h3>
                    <button onClick={onCancel} className="biometric-close">✕</button>
                </div>

                <div className="biometric-body">
                    <div className={`fingerprint-scanner ${state}`}>
                        <div className="fingerprint-icon">
                            <svg viewBox="0 0 100 100" className="fingerprint-svg">
                                {/* Fingerprint lines */}
                                <path d="M50 20 Q30 30 30 50 Q30 70 50 80" className="fp-line line-1" />
                                <path d="M50 25 Q35 32 35 50 Q35 68 50 75" className="fp-line line-2" />
                                <path d="M50 30 Q40 36 40 50 Q40 64 50 70" className="fp-line line-3" />
                                <path d="M50 35 Q45 40 45 50 Q45 60 50 65" className="fp-line line-4" />
                                
                                <path d="M50 20 Q70 30 70 50 Q70 70 50 80" className="fp-line line-5" />
                                <path d="M50 25 Q65 32 65 50 Q65 68 50 75" className="fp-line line-6" />
                                <path d="M50 30 Q60 36 60 50 Q60 64 50 70" className="fp-line line-7" />
                                <path d="M50 35 Q55 40 55 50 Q55 60 50 65" className="fp-line line-8" />
                                
                                {/* Center circle */}
                                <circle cx="50" cy="50" r="8" className="fp-center" />
                            </svg>
                        </div>

                        {state === 'scanning' && (
                            <div className="scan-wave"></div>
                        )}

                        {state === 'success' && (
                            <div className="success-check">✓</div>
                        )}

                        {state === 'error' && (
                            <div className="error-cross">✕</div>
                        )}
                    </div>

                    <p className={`biometric-message ${state}`}>{message}</p>

                    <button 
                        onClick={authenticate}
                        disabled={state === 'scanning'}
                        className="biometric-button"
                    >
                        {state === 'idle' && '🔒 Authenticate'}
                        {state === 'scanning' && '⏳ Scanning...'}
                        {state === 'success' && '✓ Success'}
                        {state === 'error' && '🔄 Try Again'}
                    </button>

                    <button onClick={onCancel} className="biometric-cancel">
                        Use password instead
                    </button>
                </div>
            </div>
        </div>
    )
}

// Function to register biometric credential after login
export async function registerBiometric(userEmail) {
    try {
        if (!window.PublicKeyCredential) {
            return { success: false, message: 'Biometric auth not supported' }
        }

        const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (!isAvailable) {
            return { success: false, message: 'No biometric authenticator available' }
        }

        // Create registration challenge
        const challenge = new Uint8Array(32)
        crypto.getRandomValues(challenge)
        
        const userId = new Uint8Array(16)
        crypto.getRandomValues(userId)

        const publicKeyCredentialCreationOptions = {
            challenge,
            rp: {
                name: 'Universal Tech Shop',
                id: window.location.hostname
            },
            user: {
                id: userId,
                name: userEmail,
                displayName: userEmail.split('@')[0]
            },
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' },  // ES256
                { alg: -257, type: 'public-key' } // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required'
            },
            timeout: 60000,
            attestation: 'none'
        }

        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        })

        if (credential) {
            // Store credential ID
            const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
            localStorage.setItem('biometricCredentialId', credentialId)
            localStorage.setItem('biometricEmail', userEmail)
            
            return { success: true, message: 'Biometric registered successfully' }
        }
    } catch (error) {
        console.error('Biometric registration error:', error)
        return { success: false, message: error.message || 'Registration failed' }
    }
}
