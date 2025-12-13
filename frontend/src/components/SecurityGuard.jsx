import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const STORAGE_KEY = 'securitySettings'
const LOCK_FLAG = 'securityLocked'

const getSettings = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch (e) {
        return {}
    }
}

export default function SecurityGuard() {
    const navigate = useNavigate()
    const location = useLocation()
    const lastActiveRef = useRef(Date.now())

    useEffect(() => {
        const markActive = () => {
            lastActiveRef.current = Date.now()
        }

        const checkLock = () => {
            const settings = getSettings()
            if (!settings.quickLockEnabled) return

            const token = localStorage.getItem('token')
            if (!token) return

            const minutes = Number(settings.lockMinutes) || 2
            const timeoutMs = minutes * 60 * 1000
            const idleMs = Date.now() - lastActiveRef.current

            if (idleMs > timeoutMs) {
                localStorage.removeItem('token')
                localStorage.setItem(LOCK_FLAG, '1')
                navigate('/login')
            }
        }

        window.addEventListener('mousemove', markActive)
        window.addEventListener('keydown', markActive)
        window.addEventListener('click', markActive)

        const interval = setInterval(checkLock, 15000)
        return () => {
            window.removeEventListener('mousemove', markActive)
            window.removeEventListener('keydown', markActive)
            window.removeEventListener('click', markActive)
            clearInterval(interval)
        }
    }, [navigate])

    useEffect(() => {
        // reset idle timer whenever route changes
        lastActiveRef.current = Date.now()
    }, [location.pathname])

    return null
}
