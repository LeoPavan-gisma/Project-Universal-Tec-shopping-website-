import { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct, getOrders, getUsers } from '../utils/api';
import { useApp } from '../context/AppContext';

const AdminPanel = () => {
  const { t, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
  
  const [newProduct, setNewProduct] = useState({ 
    title: '', price: '', description: '', imageUrl: '', category: '', stock: 0, discount: 0 
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setStats(prev => ({ ...prev, totalProducts: data.length }));
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data || []);
      const revenue = data?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;
      setStats(prev => ({ ...prev, totalOrders: data?.length || 0, totalRevenue: revenue }));
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data || []);
      setStats(prev => ({ ...prev, totalUsers: data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('❌ You must be logged in');
    
    try {
      const payload = {
        title: newProduct.title,
        price: Number(newProduct.price) || 0,
        description: newProduct.description || '',
        imageUrl: newProduct.imageUrl || '',
        category: newProduct.category || 'Electronics',
        stock: Number(newProduct.stock) || 0,
        discount: Number(newProduct.discount) || 0
      };

      await createProduct(payload, token);
      setMessage('✅ Product created successfully!');
      setNewProduct({ title: '', price: '', description: '', imageUrl: '', category: '', stock: 0, discount: 0 });
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('❌ You must be logged in');
    
    try {
      const payload = {
        title: editingProduct.title,
        price: Number(editingProduct.price) || 0,
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        category: editingProduct.category || '',
        stock: Number(editingProduct.stock) || 0,
        discount: Number(editingProduct.discount) || 0
      };

      await updateProduct(editingProduct._id, payload, token);
      setMessage('✅ Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return setMessage('❌ You must be logged in');
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id, token);
      setMessage('✅ Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error deleting: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete all products in ${filterCategory} category?`)) return;
    const filtered = getFilteredProducts();
    for (const product of filtered) {
      await handleDelete(product._id);
    }
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return (a.title || '').localeCompare(b.title || '');
        case 'stock-low': return (a.stock || 0) - (b.stock || 0);
        default: return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
    
    return filtered;
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = getFilteredProducts();

  const exportData = () => {
    const csv = [
      ['Title', 'Category', 'Price', 'Stock', 'Discount'],
      ...filteredProducts.map(p => [p.title, p.category, p.price, p.stock || 0, p.discount || 0])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl p-8 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold mb-2">🎛️ {t('admin_panel') || 'Admin Dashboard'}</h1>
          <p className="text-purple-100">Manage your e-commerce platform</p>
        </div>

        {message && (
          <div className={`${
            message.includes('✅') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
          } p-4 mb-6 rounded-xl border-2 shadow-lg animate-pulse`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['dashboard', 'products', 'orders', 'users', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {tab === 'dashboard' && '📊'}
              {tab === 'products' && '📦'}
              {tab === 'orders' && '🛒'}
              {tab === 'users' && '👥'}
              {tab === 'analytics' && '📈'}
              {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-4xl font-bold mb-1">{stats.totalProducts}</div>
                <div className="text-purple-100">Total Products</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">🛒</div>
                <div className="text-4xl font-bold mb-1">{stats.totalOrders}</div>
                <div className="text-pink-100">Total Orders</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-4xl font-bold mb-1">{formatPrice(stats.totalRevenue)}</div>
                <div className="text-blue-100">Total Revenue</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-4xl font-bold mb-1">{stats.totalUsers}</div>
                <div className="text-orange-100">Total Users</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Recent Activity</h2>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div>
                      <div className="font-semibold">Order #{order._id?.slice(-6)}</div>
                      <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{formatPrice(order.totalPrice)}</div>
                      <div className={`text-xs font-semibold ${
                        order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {order.paymentStatus || 'pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="Product Title" 
                  value={editingProduct ? editingProduct.title : newProduct.title}
                  onChange={e => editingProduct 
                    ? setEditingProduct({...editingProduct, title: e.target.value})
                    : setNewProduct({...newProduct, title: e.target.value})
                  } 
                  required 
                />
                <input 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="Price" 
                  type="number"
                  step="0.01"
                  value={editingProduct ? editingProduct.price : newProduct.price}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, price: e.target.value})
                    : setNewProduct({...newProduct, price: e.target.value})
                  } 
                  required 
                />
                <input 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="Image URL" 
                  value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, imageUrl: e.target.value})
                    : setNewProduct({...newProduct, imageUrl: e.target.value})
                  } 
                />
                <select
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none"
                  value={editingProduct ? editingProduct.category : newProduct.category}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, category: e.target.value})
                    : setNewProduct({...newProduct, category: e.target.value})
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                </select>
                <input 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="Stock" 
                  type="number"
                  value={editingProduct ? editingProduct.stock : newProduct.stock}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, stock: e.target.value})
                    : setNewProduct({...newProduct, stock: e.target.value})
                  } 
                />
                <input 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none" 
                  placeholder="Discount %" 
                  type="number"
                  min="0"
                  max="100"
                  value={editingProduct ? editingProduct.discount : newProduct.discount}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, discount: e.target.value})
                    : setNewProduct({...newProduct, discount: e.target.value})
                  } 
                />
                <textarea 
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none md:col-span-2" 
                  placeholder="Description" 
                  rows="3"
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={e => editingProduct
                    ? setEditingProduct({...editingProduct, description: e.target.value})
                    : setNewProduct({...newProduct, description: e.target.value})
                  } 
                />
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    {editingProduct ? '💾 Update Product' : '➕ Create Product'}
                  </button>
                  {editingProduct && (
                    <button 
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  className="border-2 border-gray-300 p-3 rounded-xl focus:border-purple-500 focus:outline-none"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock-low">Low Stock</option>
                </select>
                <button
                  onClick={exportData}
                  className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📦 Products ({filteredProducts.length})</h2>
                {filterCategory !== 'all' && (
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700"
                  >
                    🗑️ Bulk Delete
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Discount</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p._id} className="border-b hover:bg-purple-50 transition-colors">
                        <td className="p-3">
                          <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded-lg" onError={e => e.target.src = 'https://via.placeholder.com/64'} />
                        </td>
                        <td className="p-3 font-semibold">{p.title}</td>
                        <td className="p-3">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-purple-600">{formatPrice(p.price)}</td>
                        <td className="p-3">
                          <span className={`font-semibold ${
                            (p.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {p.stock || 0}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.discount > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{p.discount}%
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingProduct(p)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 Orders Management</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg">Order #{order._id?.slice(-8)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{formatPrice(order.totalPrice)}</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>Items:</strong> {order.items?.length || 0} product(s)
                  </div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600 ml-4">
                      • {item.title} x{item.qty} - {formatPrice(item.price * item.qty)}
                    </div>
                  ))}
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📭</div>
                  <div className="text-xl">No orders yet</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">👥 Users Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-purple-50">
                      <td className="p-3 font-semibold">{user.name}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">👤</div>
                <div className="text-xl">No users found</div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📈 Sales Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <div className="text-4xl mb-2">💵</div>
                  <div className="text-3xl font-bold text-purple-700">{formatPrice(stats.totalRevenue)}</div>
                  <div className="text-gray-600 mt-2">Total Revenue</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-3xl font-bold text-pink-700">{formatPrice(stats.totalRevenue / (stats.totalOrders || 1))}</div>
                  <div className="text-gray-600 mt-2">Avg Order Value</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-3xl font-bold text-blue-700">{((orders.filter(o => o.paymentStatus === 'paid').length / (orders.length || 1)) * 100).toFixed(0)}%</div>
                  <div className="text-gray-600 mt-2">Conversion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Top Products by Category</h2>
              <div className="space-y-4">
                {categories.map(cat => {
                  const catProducts = products.filter(p => p.category === cat);
                  return (
                    <div key={cat} className="flex items-center gap-4">
                      <div className="w-32 font-semibold text-purple-700">{cat}</div>
                      <div className="flex-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full h-8 relative">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full flex items-center justify-end pr-3"
                          style={{ width: `${(catProducts.length / products.length) * 100}%` }}
                        >
                          <span className="text-white font-bold text-sm">{catProducts.length}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

