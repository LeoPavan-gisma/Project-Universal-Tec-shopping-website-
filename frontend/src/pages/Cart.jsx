import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Cart() {
    const navigate = useNavigate()
    const { t, formatPrice } = useApp()
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'))
    const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0)

    const updateQuantity = (id, change) => {
        const updatedCart = cart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.qty + change)
                return { ...item, qty: newQty }
            }
            return item
        })
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item._id !== id)
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const clearCart = () => {
        setCart([])
        localStorage.setItem('cart', '[]')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl p-8 mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2">🛒 {t('yourCart')}</h1>
                    <p className="text-lg opacity-90">{cart.length} {cart.length !== 1 ? t('itemsInCart') : t('itemInCart')}</p>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center">
                        <div className="text-8xl mb-6">🛍️</div>
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">{t('emptyCart')}</h2>
                        <p className="text-gray-500 mb-8">{t('emptyCartMsg')}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🛒 {t('startShopping')}
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item._id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                                    <div className="flex flex-col sm:flex-row gap-4 p-6">
                                        <div className="w-full sm:w-32 h-32 flex-shrink-0">
                                            <img
                                                src={item.imageUrl || 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=300&fit=crop'}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded-xl shadow-md"
                                            />
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                                {formatPrice(item.price)}
                                            </p>

                                            <div className="flex items-center gap-4 flex-wrap">
                                                <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, -1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full font-bold text-purple-600 hover:bg-purple-100 transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full font-bold text-purple-600 hover:bg-purple-100 transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
                                                >
                                                    🗑️ {t('remove')}
                                                </button>

                                                <div className="ml-auto text-right">
                                                    <p className="text-sm text-gray-500">{t('subtotal')}</p>
                                                    <p className="text-2xl font-bold text-purple-600">{formatPrice(item.qty * item.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                🗑️ {t('clearCart')}
                            </button>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 {t('orderSummary')}</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('subtotal')}</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('shipping')}</span>
                                        <span className="font-semibold text-green-600">{t('free')} 🎉</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('tax')}</span>
                                        <span className="font-semibold">{formatPrice(total * 0.1)}</span>
                                    </div>
                                    <div className="border-t-2 border-dashed pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-800">{t('total')}</span>
                                            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
                                >
                                    🚀 {t('proceedToCheckout')}
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
                                >
                                    ← {t('continueShopping')}
                                </button>

                                <div className="mt-6 pt-6 border-t space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="text-2xl">🔒</span>
                                        <span>{t('secureCheckoutBadge')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="text-2xl">🚚</span>
                                        <span>{t('freeShippingBadge')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="text-2xl">↩️</span>
                                        <span>{t('returnPolicy')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
