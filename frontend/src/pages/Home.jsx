import { useEffect, useState } from 'react';
import { getProducts } from '../utils/api';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { t, formatPrice, currentTheme } = useApp();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const sampleProducts = [
      { _id: '1', name: 'Premium Ultrabook', price: 1299, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop' },
      { _id: '2', name: 'Smartphone Pro Max', price: 999, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=500&h=500&fit=crop' },
      { _id: '3', name: 'Studio Headphones', price: 349, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' },
      { _id: '4', name: 'Smart Watch Series 7', price: 399, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop' },
      { _id: '5', name: 'Mechanical RGB Keyboard', price: 149, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&h=500&fit=crop' },
      { _id: '6', name: 'Wireless Gaming Mouse', price: 89, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop' },
      { _id: '7', name: 'DSLR Camera Kit', price: 1199, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop' },
      { _id: '8', name: 'Tablet Pro 12.9"', price: 1099, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop' },
      { _id: '9', name: 'Smart Speaker Home', price: 129, imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&h=500&fit=crop' },
      { _id: '10', name: 'Next-Gen Console', price: 499, imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&h=500&fit=crop' },
      { _id: '11', name: 'Professional Drone', price: 1499, imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop' },
      { _id: '12', name: 'VR Headset System', price: 399, imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=500&h=500&fit=crop' },
      { _id: '13', name: '4K Monitor 27"', price: 459, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop' },
      { _id: '14', name: 'External SSD 1TB', price: 159, imageUrl: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=500&h=500&fit=crop' },
      { _id: '15', name: 'Smart Home Security Cam', price: 199, imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&h=500&fit=crop' },
      { _id: '16', name: 'Wireless Earbuds', price: 199, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop' },
      { _id: '17', name: 'Portable Projector', price: 349, imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=500&h=500&fit=crop' },
      { _id: '18', name: 'Gaming Laptop RTX', price: 1899, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop' },
      { _id: '19', name: 'Ergonomic Chair', price: 299, imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop' },
      { _id: '20', name: 'USB-C Docking Station', price: 129, imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop' },
      { _id: '21', name: 'Smart Lighting Kit', price: 179, imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop&sat=-50' },
      { _id: '22', name: 'Action Camera 4K', price: 249, imageUrl: 'https://images.unsplash.com/photo-1508896694512-1eade5586791?w=500&h=500&fit=crop' },
      { _id: '23', name: 'Mechanical Pencil Pro', price: 39, imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=500&fit=crop' },
      { _id: '24', name: 'Portable Power Bank 20K', price: 89, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&sat=-30' }
    ];

    const withAvailability = sampleProducts.map((p, idx) => ({
      ...p,
      available: Math.max(1, Math.floor(Math.random() * 8) + 1),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10,
      category: idx < 4 ? 'laptops' : idx < 8 ? 'phones' : idx < 12 ? 'audio' : idx < 16 ? 'wearables' : 'accessories',
      discount: idx % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
      featured: idx % 5 === 0
    }));
    setProducts(withAvailability);
    setFilteredProducts(withAvailability);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      switch(priceRange) {
        case 'under100':
          filtered = filtered.filter(p => p.price < 100);
          break;
        case '100to500':
          filtered = filtered.filter(p => p.price >= 100 && p.price <= 500);
          break;
        case 'over500':
          filtered = filtered.filter(p => p.price > 500);
          break;
      }
    }

    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const addToCart = (product) => {
    if (!product.available || product.available <= 0) {
      showNotif(`${product.name} is currently out of stock.`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ _id: product._id, title: product.name, price: product.price, qty: 1, imageUrl: product.imageUrl });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, available: Math.max(0, (p.available || 1) - 1) } : p));
    showNotif(`🎉 ${product.name} added to cart!`);
  };

  const toggleWishlist = (product) => {
    const newWishlist = wishlist.includes(product._id)
      ? wishlist.filter(id => id !== product._id)
      : [...wishlist, product._id];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    showNotif(wishlist.includes(product._id) ? '💔 Removed from wishlist' : '❤️ Added to wishlist');
  };

  const showNotif = (message) => {
    setStatus(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const featuredProducts = products.filter(p => p.featured);
  const categories = ['all', 'laptops', 'phones', 'audio', 'wearables', 'accessories'];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.colors.bgGradient} transition-colors duration-300`} style={{ color: currentTheme.colors.text }}>
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="text-white px-6 py-3 rounded-full shadow-2xl" style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}>
            {status}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12 px-4 shadow-2xl">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-pulse drop-shadow-lg">
            🛍️ {t('welcomeTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-6 font-light">{t('welcomeSubtitle')} 🚀</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold">✨ {t('freeShipping')}</div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold">🎁 {t('specialOffers')}</div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold">🔒 {t('secureCheckout')}</div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold">⚡ {t('fastDelivery')}</div>
          </div>
        </div>
      </div>

      {featuredProducts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 py-8 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">🔥 {t('hotDeals')}</h2>
            <div className="overflow-x-auto flex gap-6 pb-4">
              {featuredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="min-w-[280px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-2xl" />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm animate-pulse">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</span>
                      <span className="text-yellow-500">⭐ {product.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={`🔍 ${t('search')}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-200 transition-all shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📂 {t('category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-300 focus:border-pink-600 focus:ring-2 focus:ring-pink-200 font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">💰 {t('priceRange')}</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 font-semibold"
              >
                <option value="all">All Prices</option>
                <option value="under100">Under €100</option>
                <option value="100to500">€100 - €500</option>
                <option value="over500">Over €500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔄 {t('sortBy')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 font-semibold"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-center text-gray-600 font-semibold">
            {t('showing')} {filteredProducts.length} {filteredProducts.length !== 1 ? t('products') : t('product')}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-pulse">
                  🔥 {product.discount}% OFF
                </div>
              )}
              
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <span className={`text-2xl ${wishlist.includes(product._id) ? 'text-red-500' : 'text-gray-400'}`}>
                  {wishlist.includes(product._id) ? '❤️' : '🤍'}
                </span>
              </button>

              <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
                <img 
                  src={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=300&fit=crop'} 
                  alt={product.title || product.name} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <div className="p-5">
                <div className="mb-2">
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {t(product.category)}
                  </span>
                </div>

                <Link to={`/product/${product._id}`}>
                  <h2 className="text-lg font-bold text-gray-800 mb-2 hover:text-purple-600 transition-colors line-clamp-2 h-14">
                    {product.title || product.name}
                  </h2>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400 text-sm">
                    {'⭐'.repeat(Math.floor(product.rating))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    {product.discount > 0 ? (
                      <>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          €{(product.price * (1 - product.discount / 100)).toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">€{product.price}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        €{product.price}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-sm font-semibold ${product.available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.available > 0 ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {t('inStock')} ({product.available} {t('left')})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {t('outOfStock')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.available <= 0}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    🛒 {t('addToCart')}
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    👁️
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">{t('noProductsFound')}</h3>
            <p className="text-gray-500">{t('tryAdjusting')}</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {t('clearAllFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
