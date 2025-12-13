const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: Number
});

const Product = mongoose.model('Product', productSchema);

const products = [
  // ========== ROBOTS & AI ==========
  {
    title: 'AI Robot Assistant Pro',
    description: 'Advanced AI-powered robot with voice control, facial recognition, and home automation',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500',
    category: 'Robots',
    stock: 15,
    rating: 4.8,
    reviews: 89
  },
  {
    title: 'Educational Programming Robot',
    description: 'Learn coding with this interactive robot. Perfect for kids and beginners',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500',
    category: 'Robots',
    stock: 40,
    rating: 4.6,
    reviews: 145
  },
  {
    title: 'Robot Vacuum Cleaner Pro',
    description: 'Smart navigation, auto-charging, app control, and mopping function',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
    category: 'Robots',
    stock: 60,
    rating: 4.7,
    reviews: 892
  },
  {
    title: 'Humanoid Service Robot',
    description: 'Customer service robot with natural language processing and autonomous navigation',
    price: 8999.99,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500',
    category: 'Robots',
    stock: 5,
    rating: 4.9,
    reviews: 23
  },
  {
    title: 'Robot Arm Kit',
    description: 'Programmable 6-axis robot arm for education and hobbyists',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500',
    category: 'Robots',
    stock: 25,
    rating: 4.5,
    reviews: 67
  },
  {
    title: 'Drone with AI Camera',
    description: '4K camera drone with obstacle avoidance, GPS, and 30-min flight time',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500',
    category: 'Robots',
    stock: 35,
    rating: 4.6,
    reviews: 234
  },

  // ========== LAPTOPS & COMPUTERS ==========
  {
    title: 'Gaming Laptop Ultra RTX 4080',
    description: '15.6" 240Hz, Intel i9, 32GB RAM, 1TB SSD, RTX 4080',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    category: 'Laptops',
    stock: 20,
    rating: 4.9,
    reviews: 456
  },
  {
    title: 'Business Ultrabook Pro',
    description: '13.3" 4K OLED, i7, 16GB RAM, 512GB SSD, Ultra-portable',
    price: 1799.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    category: 'Laptops',
    stock: 35,
    rating: 4.7,
    reviews: 678
  },
  {
    title: 'MacBook Pro M3 Max',
    description: '16" Liquid Retina XDR, M3 Max chip, 64GB RAM, 2TB SSD',
    price: 3999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    category: 'Laptops',
    stock: 18,
    rating: 4.9,
    reviews: 1234
  },
  {
    title: 'Desktop PC Gaming Beast',
    description: 'i9-14900K, RTX 4090, 64GB DDR5, 2TB NVMe, RGB Cooling',
    price: 4299.99,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500',
    category: 'Computers',
    stock: 12,
    rating: 4.8,
    reviews: 345
  },
  {
    title: 'All-in-One PC 27"',
    description: '27" 4K touchscreen, i7, 16GB RAM, 1TB SSD, wireless keyboard & mouse',
    price: 1599.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Computers',
    stock: 28,
    rating: 4.6,
    reviews: 234
  },

  // ========== SMARTPHONES & TABLETS ==========
  {
    title: 'Flagship Smartphone Pro Max',
    description: '6.7" AMOLED, 256GB, 5G, 108MP camera, wireless charging',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    category: 'Smartphones',
    stock: 80,
    rating: 4.8,
    reviews: 2345
  },
  {
    title: 'Budget 5G Smartphone',
    description: '6.5" display, 128GB, 5G, 48MP camera, all-day battery',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    category: 'Smartphones',
    stock: 150,
    rating: 4.3,
    reviews: 567
  },
  {
    title: 'iPad Pro 12.9" M2',
    description: '12.9" Liquid Retina XDR, M2 chip, 256GB, Apple Pencil support',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    category: 'Tablets',
    stock: 45,
    rating: 4.9,
    reviews: 890
  },
  {
    title: 'Android Tablet 11"',
    description: '11" 2K display, Snapdragon 8 Gen 2, 256GB, stylus included',
    price: 649.99,
    image: 'https://images.unsplash.com/photo-1585789575149-53c72d97a6e6?w=500',
    category: 'Tablets',
    stock: 60,
    rating: 4.5,
    reviews: 456
  },

  // ========== AUDIO & HEADPHONES ==========
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Audio',
    stock: 100,
    rating: 4.5,
    reviews: 234
  },
  {
    title: 'Studio Monitor Headphones Pro',
    description: 'Professional studio-grade headphones with planar magnetic drivers',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    category: 'Audio',
    stock: 30,
    rating: 4.8,
    reviews: 178
  },
  {
    title: 'True Wireless Earbuds Pro',
    description: 'ANC, transparency mode, 24hr battery, wireless charging case',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    category: 'Audio',
    stock: 120,
    rating: 4.7,
    reviews: 1234
  },
  {
    title: 'Bluetooth Speaker Portable',
    description: 'Waterproof speaker with 360° sound and 12-hour battery',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Audio',
    stock: 85,
    rating: 4.6,
    reviews: 523
  },
  {
    title: 'Smart Speaker with Alexa',
    description: 'Voice-controlled smart speaker with premium sound and smart home hub',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500',
    category: 'Audio',
    stock: 95,
    rating: 4.5,
    reviews: 789
  },
  {
    title: 'Soundbar 5.1 Surround',
    description: 'Wireless soundbar with subwoofer and rear speakers for home theater',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
    category: 'Audio',
    stock: 42,
    rating: 4.7,
    reviews: 345
  },

  // ========== CAMERAS & PHOTOGRAPHY ==========
  {
    title: 'Mirrorless Camera 4K 60fps',
    description: '24MP full-frame sensor, 4K 60fps video, image stabilization',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    category: 'Cameras',
    stock: 25,
    rating: 4.8,
    reviews: 234
  },
  {
    title: 'Action Camera 4K',
    description: 'Waterproof action cam with 4K 120fps, voice control, stabilization',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Cameras',
    stock: 65,
    rating: 4.6,
    reviews: 567
  },
  {
    title: 'Instant Camera with Printer',
    description: 'Digital instant camera with built-in printer and filters',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    category: 'Cameras',
    stock: 48,
    rating: 4.4,
    reviews: 289
  },
  {
    title: '4K Ultra HD Webcam',
    description: 'Professional quality video calls with auto-focus and dual microphones',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    category: 'Cameras',
    stock: 90,
    rating: 4.3,
    reviews: 189
  },

  // ========== GAMING ==========
  {
    title: 'Mechanical Gaming Keyboard RGB',
    description: 'Cherry MX switches, RGB per-key lighting, programmable macros',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
    category: 'Gaming',
    stock: 75,
    rating: 4.6,
    reviews: 423
  },
  {
    title: 'Gaming Mouse Wireless Pro',
    description: '25K DPI sensor, wireless charging, RGB lighting, 8 buttons',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Gaming',
    stock: 100,
    rating: 4.7,
    reviews: 678
  },
  {
    title: 'Gaming Headset 7.1 Surround',
    description: '7.1 surround sound with noise-cancelling mic and RGB lighting',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500',
    category: 'Gaming',
    stock: 85,
    rating: 4.4,
    reviews: 234
  },
  {
    title: 'Gaming Chair Ergonomic Pro',
    description: 'Ergonomic racing chair with lumbar support, adjustable armrests, reclining',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500',
    category: 'Gaming',
    stock: 35,
    rating: 4.7,
    reviews: 567
  },
  {
    title: 'Gaming Desk RGB LED',
    description: 'Large gaming desk with cable management, RGB lighting, mouse pad surface',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
    category: 'Gaming',
    stock: 28,
    rating: 4.5,
    reviews: 234
  },
  {
    title: 'VR Headset Standalone',
    description: 'Wireless VR headset with 4K display, hand tracking, 256GB storage',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500',
    category: 'Gaming',
    stock: 40,
    rating: 4.8,
    reviews: 456
  },

  // ========== MONITORS & DISPLAYS ==========
  {
    title: '4K Monitor 32" Professional',
    description: '32" 4K IPS, 99% sRGB, USB-C, height adjustable stand',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    category: 'Monitors',
    stock: 45,
    rating: 4.7,
    reviews: 789
  },
  {
    title: 'Gaming Monitor 27" 240Hz',
    description: '27" QHD, 240Hz, 1ms, G-Sync, HDR, curved display',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500',
    category: 'Monitors',
    stock: 55,
    rating: 4.8,
    reviews: 567
  },
  {
    title: 'Ultrawide Monitor 34"',
    description: '34" ultrawide curved, 144Hz, QHD, perfect for productivity & gaming',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    category: 'Monitors',
    stock: 32,
    rating: 4.7,
    reviews: 345
  },
  {
    title: 'Portable Monitor 15.6"',
    description: 'USB-C portable monitor, 1080p IPS, lightweight, with cover',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    category: 'Monitors',
    stock: 68,
    rating: 4.4,
    reviews: 234
  },

  // ========== WEARABLES & SMART DEVICES ==========
  {
    title: 'Smart Watch Pro Fitness',
    description: 'Fitness tracking, heart rate monitor, GPS, notifications, 7-day battery',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Wearables',
    stock: 90,
    rating: 4.7,
    reviews: 567
  },
  {
    title: 'Fitness Tracker Band',
    description: 'Water-resistant fitness band with sleep tracking and 14-day battery',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
    category: 'Wearables',
    stock: 120,
    rating: 4.3,
    reviews: 789
  },
  {
    title: 'Smart Ring Health Monitor',
    description: 'Sleep, activity, heart rate tracking in a stylish ring',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    category: 'Wearables',
    stock: 45,
    rating: 4.6,
    reviews: 234
  },
  {
    title: 'Smart Glasses AR',
    description: 'Augmented reality smart glasses with voice assistant and camera',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
    category: 'Wearables',
    stock: 22,
    rating: 4.5,
    reviews: 123
  },

  // ========== SMART HOME ==========
  {
    title: 'Smart Home Hub Controller',
    description: 'Central hub for all smart home devices with voice control',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
    category: 'Smart Home',
    stock: 70,
    rating: 4.6,
    reviews: 456
  },
  {
    title: 'Smart Light Bulbs 4-Pack',
    description: 'RGB color changing WiFi bulbs with app and voice control',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=500',
    category: 'Smart Home',
    stock: 200,
    rating: 4.4,
    reviews: 890
  },
  {
    title: 'Smart Doorbell Camera',
    description: '1080p HD video doorbell with motion detection and two-way audio',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
    category: 'Smart Home',
    stock: 85,
    rating: 4.7,
    reviews: 678
  },
  {
    title: 'Smart Thermostat WiFi',
    description: 'Programmable WiFi thermostat with energy savings and voice control',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500',
    category: 'Smart Home',
    stock: 55,
    rating: 4.6,
    reviews: 345
  },
  {
    title: 'Security Camera System 4-Pack',
    description: 'Wireless security cameras with night vision, motion alerts, cloud storage',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
    category: 'Smart Home',
    stock: 40,
    rating: 4.7,
    reviews: 567
  },

  // ========== ACCESSORIES ==========
  {
    title: 'Wireless Mouse Ergonomic',
    description: 'Ergonomic design with precision tracking and long battery life',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Accessories',
    stock: 150,
    rating: 4.4,
    reviews: 312
  },
  {
    title: 'USB-C Hub 10-in-1',
    description: 'Multi-port adapter with HDMI, USB 3.0, SD card, Ethernet, PD charging',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Accessories',
    stock: 120,
    rating: 4.5,
    reviews: 456
  },
  {
    title: 'Laptop Stand Aluminum',
    description: 'Adjustable aluminum laptop stand with ergonomic design',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Accessories',
    stock: 95,
    rating: 4.5,
    reviews: 289
  },
  {
    title: 'Wireless Charger 3-in-1',
    description: 'Fast charging pad for phone, watch, and earbuds simultaneously',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1591290619762-c588a79b6f3c?w=500',
    category: 'Accessories',
    stock: 110,
    rating: 4.6,
    reviews: 445
  },
  {
    title: 'Power Bank 30000mAh',
    description: 'Ultra high capacity portable charger with fast charging and LED display',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    category: 'Accessories',
    stock: 140,
    rating: 4.6,
    reviews: 678
  },
  {
    title: 'Cable Management Bundle',
    description: 'Complete cable organizer kit with clips, sleeves, and ties',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Accessories',
    stock: 250,
    rating: 4.1,
    reviews: 289
  },

  // ========== STORAGE ==========
  {
    title: 'Portable SSD 2TB',
    description: 'Ultra-fast external SSD with USB-C 3.2 Gen 2, 1050MB/s read speed',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    category: 'Storage',
    stock: 80,
    rating: 4.8,
    reviews: 678
  },
  {
    title: 'NAS Network Storage 4-Bay',
    description: '4-bay NAS with dual Ethernet, supports up to 72TB, RAID support',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    category: 'Storage',
    stock: 25,
    rating: 4.7,
    reviews: 234
  },
  {
    title: 'External HDD 5TB',
    description: 'High-capacity portable hard drive with USB 3.0',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    category: 'Storage',
    stock: 95,
    rating: 4.4,
    reviews: 456
  },
  {
    title: 'microSD Card 512GB',
    description: 'Ultra-fast microSD card A2, UHS-I U3, 170MB/s read speed',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    category: 'Storage',
    stock: 180,
    rating: 4.6,
    reviews: 789
  },

  // ========== NETWORKING ==========
  {
    title: 'WiFi 6E Mesh Router System',
    description: 'Tri-band mesh WiFi 6E system covers 6000 sq ft, up to 3Gbps',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500',
    category: 'Networking',
    stock: 45,
    rating: 4.8,
    reviews: 345
  },
  {
    title: 'Gaming Router WiFi 6',
    description: 'Gaming router with QoS, DFS channels, RGB lighting, 8 antennas',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500',
    category: 'Networking',
    stock: 38,
    rating: 4.7,
    reviews: 267
  },
  {
    title: 'Network Switch 8-Port Gigabit',
    description: 'Unmanaged 8-port gigabit switch with metal housing',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500',
    category: 'Networking',
    stock: 75,
    rating: 4.5,
    reviews: 234
  },

  // ========== PRINTERS & SCANNERS ==========
  {
    title: 'All-in-One Printer Color',
    description: 'Wireless color printer with scan, copy, fax, auto-duplex, mobile printing',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
    category: 'Printers',
    stock: 42,
    rating: 4.4,
    reviews: 456
  },
  {
    title: 'Portable Photo Printer',
    description: 'Compact photo printer for smartphones, prints 4x6 photos instantly',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
    category: 'Printers',
    stock: 60,
    rating: 4.3,
    reviews: 234
  },
  {
    title: 'Document Scanner Portable',
    description: 'High-speed portable scanner with WiFi, scan to cloud, battery powered',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
    category: 'Printers',
    stock: 35,
    rating: 4.5,
    reviews: 178
  },

  // ========== 3D PRINTING ==========
  {
    title: '3D Printer Resin High Precision',
    description: 'Resin 3D printer with 4K LCD, auto-leveling, WiFi control',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1580493111450-ee4e2b1e0bd6?w=500',
    category: '3D Printing',
    stock: 28,
    rating: 4.7,
    reviews: 156
  },
  {
    title: '3D Printer FDM Large Format',
    description: 'Large format FDM 3D printer 400x400x400mm build volume',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1580493111450-ee4e2b1e0bd6?w=500',
    category: '3D Printing',
    stock: 18,
    rating: 4.6,
    reviews: 123
  },
  {
    title: '3D Printing Filament Bundle',
    description: 'PLA filament 10-color bundle, 1kg per roll, 1.75mm',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1580493111450-ee4e2b1e0bd6?w=500',
    category: '3D Printing',
    stock: 85,
    rating: 4.4,
    reviews: 234
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Show category breakdown
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('\n📊 Products by category:');
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
