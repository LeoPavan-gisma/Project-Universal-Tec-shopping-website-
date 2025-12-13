import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AppProvider, useApp } from './context/AppContext'

import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import AiAssistant from './pages/AiAssistant'
import ApiKeySettings from './pages/ApiKeySettings'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import SecurityGuard from './components/SecurityGuard'
import ApiKeyGate from './components/ApiKeyGate'
import Payment from './pages/Payment'
import Tracking from './pages/Tracking'
import OrderSuccess from './pages/OrderSuccess'
import PasswordReset from './pages/PasswordReset'

// App wrapper component to handle API key validation
const App = () => {
    const { isApiKeyValid, validateApiKey } = useApp();

    // If API key is not valid, show the API key gate
    if (!isApiKeyValid) {
        return <ApiKeyGate onValidate={validateApiKey} />;
    }

    // API key is valid, show the main app
    return (
        <BrowserRouter>
            <SecurityGuard />
            <NavBar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/product/:id" element={<ProductPage/>} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/password-reset" element={<PasswordReset/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/admin" element={<AdminPanel/>} />
                <Route path="/ai" element={<AiAssistant/>} />
                <Route path="/api-settings" element={<ApiKeySettings/>} />
                <Route path="/payment" element={<Payment/>} />
                <Route path="/tracking" element={<Tracking/>} />
                <Route path="/order-success" element={<OrderSuccess/>} />
            </Routes>
            <ChatWidget />
            <Footer />
        </BrowserRouter>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
)
