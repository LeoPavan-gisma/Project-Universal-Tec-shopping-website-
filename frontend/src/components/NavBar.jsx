import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function NavBar() {
    const [showMenu, setShowMenu] = useState(false)
    const [showLangMenu, setShowLangMenu] = useState(false)
    const [showCurrMenu, setShowCurrMenu] = useState(false)
    const [showThemeMenu, setShowThemeMenu] = useState(false)
    const [showApiKeyMenu, setShowApiKeyMenu] = useState(false)
    const token = localStorage.getItem('token')
    const { language, setLanguage, currency, setCurrency, theme, setTheme, t, currencyRates, themes, currentTheme, apiKey, removeApiKey } = useApp()

    const languageFlags = {
        en: '🇬🇧',
        te: '🇮🇳',
        de: '🇩🇪'
    }

    const languageNames = {
        en: 'English',
        te: 'తెలుగు',
        de: 'Deutsch'
    }

    const handleLogoutApiKey = () => {
        if (window.confirm('Are you sure you want to remove your API key? You will need to re-enter it to access the site.')) {
            removeApiKey();
            window.location.reload();
        }
    }

    return (
        <nav className="backdrop-blur-sm shadow-lg px-4 md:px-6 py-4 sticky top-0 z-50 transition-all duration-300" style={{ backgroundColor: currentTheme.colors.navBg, color: currentTheme.colors.text }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition" style={{ color: currentTheme.colors.primary }}>
                        🛍️ Universal Tech Shop
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="md:hidden flex flex-col gap-1 p-2"
                    >
                        <span className="w-6 h-0.5" style={{ backgroundColor: currentTheme.colors.text }}></span>
                        <span className="w-6 h-0.5" style={{ backgroundColor: currentTheme.colors.text }}></span>
                        <span className="w-6 h-0.5" style={{ backgroundColor: currentTheme.colors.text }}></span>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex gap-2 lg:gap-4 text-sm lg:text-base flex-wrap justify-end items-center">
                        {/* Theme Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowThemeMenu(!showThemeMenu)}
                                className="px-3 py-2 rounded-lg transition font-medium flex items-center gap-1 hover:opacity-80"
                                style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}
                            >
                                <span className="text-xl">{themes[theme].icon}</span>
                                <span className="hidden lg:inline">{themes[theme].name}</span>
                            </button>
                            {showThemeMenu && (
                                <div className="absolute top-full right-0 mt-2 rounded-lg shadow-xl border py-2 min-w-[200px] z-50" style={{ backgroundColor: currentTheme.colors.cardBg, borderColor: currentTheme.colors.border }}>
                                    <div className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: currentTheme.colors.textSecondary }}>
                                        Select Theme
                                    </div>
                                    {Object.keys(themes).map(themeKey => (
                                        <button
                                            key={themeKey}
                                            onClick={() => {
                                                setTheme(themeKey)
                                                setShowThemeMenu(false)
                                            }}
                                            className={`w-full px-4 py-2 hover:opacity-80 flex items-center gap-3 transition ${theme === themeKey ? 'font-bold' : ''}`}
                                            style={{ 
                                                backgroundColor: theme === themeKey ? currentTheme.colors.primary : 'transparent',
                                                color: theme === themeKey ? '#ffffff' : currentTheme.colors.text
                                            }}
                                        >
                                            <span className="text-lg">{themes[themeKey].icon}</span>
                                            <span>{themes[themeKey].name}</span>
                                            {theme === themeKey && <span className="ml-auto">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="px-3 py-2 rounded-lg transition font-medium flex items-center gap-1 hover:opacity-80"
                                style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}
                            >
                                <span>{languageFlags[language]}</span>
                                <span className="hidden lg:inline">{languageNames[language]}</span>
                            </button>
                            {showLangMenu && (
                                <div className="absolute top-full right-0 mt-2 rounded-lg shadow-xl border py-2 min-w-[150px] z-50" style={{ backgroundColor: currentTheme.colors.cardBg, borderColor: currentTheme.colors.border }}>
                                    {Object.keys(languageNames).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang)
                                                setShowLangMenu(false)
                                            }}
                                            className={`w-full px-4 py-2 hover:opacity-80 flex items-center gap-2 ${language === lang ? 'font-bold' : ''}`}
                                            style={{ 
                                                backgroundColor: language === lang ? currentTheme.colors.primary : 'transparent',
                                                color: language === lang ? '#ffffff' : currentTheme.colors.text
                                            }}
                                        >
                                            <span>{languageFlags[lang]}</span>
                                            <span>{languageNames[lang]}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Currency Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCurrMenu(!showCurrMenu)}
                                className="px-3 py-2 rounded-lg transition font-medium flex items-center gap-1 hover:opacity-80"
                                style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}
                            >
                                <span>{currencyRates[currency].symbol}</span>
                                <span>{currency}</span>
                            </button>
                            {showCurrMenu && (
                                <div className="absolute top-full right-0 mt-2 rounded-lg shadow-xl border py-2 min-w-[150px] z-50" style={{ backgroundColor: currentTheme.colors.cardBg, borderColor: currentTheme.colors.border }}>
                                    {Object.keys(currencyRates).map(curr => (
                                        <button
                                            key={curr}
                                            onClick={() => {
                                                setCurrency(curr)
                                                setShowCurrMenu(false)
                                            }}
                                            className={`w-full px-4 py-2 hover:opacity-80 flex items-center gap-2 ${currency === curr ? 'font-bold' : ''}`}
                                            style={{ 
                                                backgroundColor: currency === curr ? currentTheme.colors.primary : 'transparent',
                                                color: currency === curr ? '#ffffff' : currentTheme.colors.text
                                            }}
                                        >
                                            <span>{currencyRates[curr].symbol}</span>
                                            <span>{curr} - {currencyRates[curr].name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🏠 {t('home')}</Link>
                        <Link to="/cart" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🛒 {t('cart')}</Link>
                        <Link to="/tracking" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>📍 {t('track')}</Link>
                        <Link to="/payment" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>💳 {t('payment')}</Link>
                        <Link to="/ai" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🤖 AI</Link>
                        <Link to="/dashboard" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>👤 {t('dashboard')}</Link>
                        <Link to="/admin" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>⚙️ {t('admin')}</Link>

                        {/* API Key Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowApiKeyMenu(!showApiKeyMenu)}
                                className="px-3 py-2 rounded-lg transition font-medium flex items-center gap-1 hover:opacity-80"
                                style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
                                title="API Key Settings"
                            >
                                🔑 API
                            </button>
                            {showApiKeyMenu && (
                                <div className="absolute top-full right-0 mt-2 rounded-lg shadow-xl border py-2 min-w-[250px] z-50" style={{ backgroundColor: currentTheme.colors.cardBg, borderColor: currentTheme.colors.border }}>
                                    <div className="px-4 py-2 border-b" style={{ borderColor: currentTheme.colors.border }}>
                                        <p className="text-xs font-semibold uppercase" style={{ color: currentTheme.colors.textSecondary }}>API Security</p>
                                        <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                                            Key: {apiKey ? `${apiKey.substring(0, 8)}...` : 'None'}
                                        </p>
                                    </div>
                                    <Link
                                        to="/api-settings"
                                        onClick={() => setShowApiKeyMenu(false)}
                                        className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-2 transition block"
                                        style={{ color: currentTheme.colors.text }}
                                    >
                                        <span>⚙️</span>
                                        <span>API Key Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogoutApiKey}
                                        className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-2 transition"
                                        style={{ color: '#ef4444' }}
                                    >
                                        <span>🚪</span>
                                        <span>Remove API Key</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {token ? (
                            <Link to="/logout" onClick={(e) => { e.preventDefault(); localStorage.clear(); window.location.href = '/login' }} className="px-4 py-2 rounded-lg transition font-bold" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>🚺 {t('logout')}</Link>
                        ) : (
                            <>
                                <Link to="/register" className="px-3 py-2 rounded-lg transition font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>➕ {t('register')}</Link>
                                <Link to="/login" className="px-4 py-2 rounded-lg transition font-bold" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>🔐 {t('login')}</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {showMenu && (
                    <div className="md:hidden mt-4 pb-4 flex flex-col gap-2 border-t pt-4" style={{ borderColor: currentTheme.colors.border }}>
                        {/* Mobile Theme, Language & Currency */}
                        <div className="flex flex-col gap-2 mb-2">
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="px-3 py-2 rounded-lg border"
                                style={{ backgroundColor: currentTheme.colors.cardBg, color: currentTheme.colors.text, borderColor: currentTheme.colors.border }}
                            >
                                {Object.keys(themes).map(themeKey => (
                                    <option key={themeKey} value={themeKey}>{themes[themeKey].icon} {themes[themeKey].name}</option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border"
                                    style={{ backgroundColor: currentTheme.colors.cardBg, color: currentTheme.colors.text, borderColor: currentTheme.colors.border }}
                                >
                                    {Object.keys(languageNames).map(lang => (
                                        <option key={lang} value={lang}>{languageFlags[lang]} {languageNames[lang]}</option>
                                    ))}
                                </select>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border"
                                    style={{ backgroundColor: currentTheme.colors.cardBg, color: currentTheme.colors.text, borderColor: currentTheme.colors.border }}
                                >
                                    {Object.keys(currencyRates).map(curr => (
                                        <option key={curr} value={curr}>{currencyRates[curr].symbol} {curr}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <Link to="/" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🏠 {t('home')}</Link>
                        <Link to="/cart" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🛒 {t('cart')}</Link>
                        <Link to="/tracking" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>📍 {t('track')}</Link>
                        <Link to="/payment" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>💳 {t('payment')}</Link>
                        <Link to="/ai" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>🤖 AI</Link>
                        <Link to="/dashboard" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>👤 {t('dashboard')}</Link>
                        <Link to="/admin" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>⚙️ {t('admin')}</Link>
                        
                        {/* Mobile API Key Buttons */}
                        <Link
                            to="/api-settings"
                            onClick={() => setShowMenu(false)}
                            className="block px-4 py-2 rounded-lg font-medium"
                            style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
                        >
                            🔑 API Key Settings
                        </Link>
                        
                        {token ? (
                            <Link to="/logout" onClick={(e) => { e.preventDefault(); localStorage.clear(); window.location.href = '/login' }} className="block px-4 py-2 rounded-lg font-bold" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>🚪 {t('logout')}</Link>
                        ) : (
                            <>
                                <Link to="/register" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: theme === 'dark' || theme === 'midnight' ? currentTheme.colors.cardBg : '#f3f4f6' }}>➕ {t('register')}</Link>
                                <Link to="/login" onClick={() => setShowMenu(false)} className="block px-4 py-2 rounded-lg font-bold" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>🔐 {t('login')}</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
