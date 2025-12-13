import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../utils/api';

// Fallback sample catalog for offline/product lookup
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

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data && !data.error) {
          setProduct(data);
        } else {
          const fallback = sampleProducts.find(p => p._id === id);
          setProduct(fallback || null);
        }
      } catch (err) {
        const fallback = sampleProducts.find(p => p._id === id);
        if (fallback) {
          setProduct(fallback);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ _id: product._id, title: product.title || product.name, price: product.price, qty: 1, imageUrl: product.imageUrl });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/400'} 
            alt={product.title || product.name} 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title || product.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-4">€{product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button onClick={addToCart} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
