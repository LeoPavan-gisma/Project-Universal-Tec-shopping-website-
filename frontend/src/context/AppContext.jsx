import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navigation
    home: 'Home',
    cart: 'Cart',
    track: 'Track',
    payment: 'Payment',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    
    // Home page
    welcomeTitle: 'Universal Tech Shop',
    welcomeSubtitle: 'Discover Amazing Tech at Unbeatable Prices!',
    freeShipping: 'Free Shipping',
    specialOffers: 'Special Offers',
    secureCheckout: 'Secure Checkout',
    fastDelivery: 'Fast Delivery',
    hotDeals: 'Hot Deals - Limited Time!',
    search: 'Search for products...',
    category: 'Category',
    allCategories: 'All Categories',
    priceRange: 'Price Range',
    allPrices: 'All Prices',
    under: 'Under',
    sortBy: 'Sort By',
    featured: 'Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    highestRated: 'Highest Rated',
    mostPopular: 'Most Popular',
    showing: 'Showing',
    products: 'products',
    product: 'product',
    
    // Product card
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    left: 'left',
    off: 'OFF',
    addedToCart: 'added to cart!',
    outOfStockMsg: 'is currently out of stock.',
    addedToWishlist: 'Added to wishlist',
    removedFromWishlist: 'Removed from wishlist',
    
    // Cart page
    yourCart: 'Your Shopping Cart',
    itemInCart: 'item in your cart',
    itemsInCart: 'items in your cart',
    emptyCart: 'Your cart is empty',
    emptyCartMsg: 'Start shopping and add some amazing products!',
    startShopping: 'Start Shopping',
    remove: 'Remove',
    subtotal: 'Subtotal',
    clearCart: 'Clear Entire Cart',
    orderSummary: 'Order Summary',
    shipping: 'Shipping',
    free: 'FREE',
    tax: 'Tax (included)',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    secureCheckoutBadge: 'Secure Checkout',
    freeShippingBadge: 'Free Shipping on All Orders',
    returnPolicy: '30-Day Return Policy',
    
    // Filters
    noProductsFound: 'No products found',
    tryAdjusting: 'Try adjusting your filters or search term',
    clearAllFilters: 'Clear All Filters',
    
    // Categories
    laptops: 'Laptops',
    phones: 'Phones',
    audio: 'Audio',
    wearables: 'Wearables',
    accessories: 'Accessories',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    cart: 'కార్ట్',
    track: 'ట్రాక్',
    payment: 'చెల్లింపు',
    dashboard: 'డాష్‌బోర్డ్',
    admin: 'అడ్మిన్',
    login: 'లాగిన్',
    logout: 'లాగౌట్',
    register: 'రిజిస్టర్',
    
    // Home page
    welcomeTitle: 'యూనివర్సల్ టెక్ షాప్',
    welcomeSubtitle: 'అద్భుతమైన టెక్నాలజీని అసాధారణమైన ధరలలో కనుగొనండి!',
    freeShipping: 'ఉచిత షిప్పింగ్',
    specialOffers: 'ప్రత్యేక ఆఫర్లు',
    secureCheckout: 'సురక్షిత చెక్అవుట్',
    fastDelivery: 'వేగవంతమైన డెలివరీ',
    hotDeals: 'హాట్ డీల్స్ - పరిమిత సమయం!',
    search: 'ఉత్పత్తుల కోసం వెతకండి...',
    category: 'వర్గం',
    allCategories: 'అన్ని వర్గాలు',
    priceRange: 'ధర పరిధి',
    allPrices: 'అన్ని ధరలు',
    under: 'కింద',
    sortBy: 'ఇలా క్రమబద్ధీకరించండి',
    featured: 'ఫీచర్ చేయబడినవి',
    priceLowToHigh: 'ధర: తక్కువ నుండి ఎక్కువ',
    priceHighToLow: 'ధర: ఎక్కువ నుండి తక్కువ',
    highestRated: 'అత్యధిక రేటింగ్',
    mostPopular: 'అత్యంత ప్రజాదరణ',
    showing: 'చూపిస్తోంది',
    products: 'ఉత్పత్తులు',
    product: 'ఉత్పత్తి',
    
    // Product card
    addToCart: 'కార్ట్‌కు జోడించండి',
    viewDetails: 'వివరాలు చూడండి',
    inStock: 'స్టాక్‌లో ఉంది',
    outOfStock: 'స్టాక్ అయిపోయింది',
    left: 'మిగిలి ఉన్నాయి',
    off: 'తగ్గింపు',
    addedToCart: 'కార్ట్‌కు జోడించబడింది!',
    outOfStockMsg: 'ప్రస్తుతం స్టాక్‌లో లేదు.',
    addedToWishlist: 'విష్‌లిస్ట్‌కు జోడించబడింది',
    removedFromWishlist: 'విష్‌లిస్ట్ నుండి తొలగించబడింది',
    
    // Cart page
    yourCart: 'మీ షాపింగ్ కార్ట్',
    itemInCart: 'మీ కార్ట్‌లో వస్తువు',
    itemsInCart: 'మీ కార్ట్‌లో వస్తువులు',
    emptyCart: 'మీ కార్ట్ ఖాళీగా ఉంది',
    emptyCartMsg: 'షాపింగ్ ప్రారంభించండి మరియు అద్భుతమైన ఉత్పత్తులను జోడించండి!',
    startShopping: 'షాపింగ్ ప్రారంభించండి',
    remove: 'తొలగించు',
    subtotal: 'ఉపమొత్తం',
    clearCart: 'మొత్తం కార్ట్ క్లియర్ చేయండి',
    orderSummary: 'ఆర్డర్ సారాంశం',
    shipping: 'షిప్పింగ్',
    free: 'ఉచితం',
    tax: 'పన్ను (చేర్చబడింది)',
    total: 'మొత్తం',
    proceedToCheckout: 'చెక్అవుట్‌కు కొనసాగండి',
    continueShopping: 'షాపింగ్ కొనసాగించండి',
    secureCheckoutBadge: 'సురక్షిత చెక్అవుట్',
    freeShippingBadge: 'అన్ని ఆర్డర్లపై ఉచిత షిప్పింగ్',
    returnPolicy: '30-రోజుల రిటర్న్ పాలసీ',
    
    // Filters
    noProductsFound: 'ఉత్పత్తులు కనుగొనబడలేదు',
    tryAdjusting: 'మీ ఫిల్టర్లు లేదా శోధన పదాన్ని సర్దుబాటు చేయడానికి ప్రయత్నించండి',
    clearAllFilters: 'అన్ని ఫిల్టర్లను క్లియర్ చేయండి',
    
    // Categories
    laptops: 'ల్యాప్‌టాప్‌లు',
    phones: 'ఫోన్లు',
    audio: 'ఆడియో',
    wearables: 'వేరబుల్స్',
    accessories: 'యాక్సెసరీస్',
  },
  de: {
    // Navigation
    home: 'Startseite',
    cart: 'Warenkorb',
    track: 'Verfolgen',
    payment: 'Zahlung',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Anmelden',
    logout: 'Abmelden',
    register: 'Registrieren',
    
    // Home page
    welcomeTitle: 'Universal Tech Shop',
    welcomeSubtitle: 'Entdecken Sie erstaunliche Technik zu unschlagbaren Preisen!',
    freeShipping: 'Kostenloser Versand',
    specialOffers: 'Sonderangebote',
    secureCheckout: 'Sichere Kasse',
    fastDelivery: 'Schnelle Lieferung',
    hotDeals: 'Heiße Angebote - Begrenzte Zeit!',
    search: 'Produkte suchen...',
    category: 'Kategorie',
    allCategories: 'Alle Kategorien',
    priceRange: 'Preisspanne',
    allPrices: 'Alle Preise',
    under: 'Unter',
    sortBy: 'Sortieren nach',
    featured: 'Vorgestellt',
    priceLowToHigh: 'Preis: Niedrig bis Hoch',
    priceHighToLow: 'Preis: Hoch bis Niedrig',
    highestRated: 'Am besten bewertet',
    mostPopular: 'Am beliebtesten',
    showing: 'Zeige',
    products: 'Produkte',
    product: 'Produkt',
    
    // Product card
    addToCart: 'In den Warenkorb',
    viewDetails: 'Details anzeigen',
    inStock: 'Auf Lager',
    outOfStock: 'Ausverkauft',
    left: 'übrig',
    off: 'RABATT',
    addedToCart: 'zum Warenkorb hinzugefügt!',
    outOfStockMsg: 'ist derzeit nicht vorrätig.',
    addedToWishlist: 'Zur Wunschliste hinzugefügt',
    removedFromWishlist: 'Von der Wunschliste entfernt',
    
    // Cart page
    yourCart: 'Ihr Warenkorb',
    itemInCart: 'Artikel in Ihrem Warenkorb',
    itemsInCart: 'Artikel in Ihrem Warenkorb',
    emptyCart: 'Ihr Warenkorb ist leer',
    emptyCartMsg: 'Beginnen Sie mit dem Einkaufen und fügen Sie tolle Produkte hinzu!',
    startShopping: 'Einkaufen beginnen',
    remove: 'Entfernen',
    subtotal: 'Zwischensumme',
    clearCart: 'Gesamten Warenkorb leeren',
    orderSummary: 'Bestellübersicht',
    shipping: 'Versand',
    free: 'KOSTENLOS',
    tax: 'Steuern (inbegriffen)',
    total: 'Gesamt',
    proceedToCheckout: 'Zur Kasse gehen',
    continueShopping: 'Weiter einkaufen',
    secureCheckoutBadge: 'Sichere Kasse',
    freeShippingBadge: 'Kostenloser Versand bei allen Bestellungen',
    returnPolicy: '30-Tage Rückgaberecht',
    
    // Filters
    noProductsFound: 'Keine Produkte gefunden',
    tryAdjusting: 'Versuchen Sie, Ihre Filter oder Suchbegriffe anzupassen',
    clearAllFilters: 'Alle Filter löschen',
    
    // Categories
    laptops: 'Laptops',
    phones: 'Telefone',
    audio: 'Audio',
    wearables: 'Wearables',
    accessories: 'Zubehör',
  }
};

// Currency conversion rates (base: EUR)
const currencyRates = {
  EUR: { symbol: '€', rate: 1, name: 'Euro' },
  USD: { symbol: '$', rate: 1.09, name: 'US Dollar' },
  GBP: { symbol: '£', rate: 0.86, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 163.50, name: 'Japanese Yen' },
  CNY: { symbol: '¥', rate: 7.85, name: 'Chinese Yuan' },
  INR: { symbol: '₹', rate: 90.50, name: 'Indian Rupee' },
};

// Theme configurations
const themes = {
  light: {
    name: 'Light',
    icon: '☀️',
    colors: {
      bg: '#ffffff',
      bgGradient: 'from-purple-50 via-pink-50 to-blue-50',
      text: '#111827',
      textSecondary: '#6b7280',
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#3b82f6',
      cardBg: '#ffffff',
      navBg: '#ffffff',
      border: '#e5e7eb',
      shadow: 'shadow-lg',
    }
  },
  dark: {
    name: 'Dark',
    icon: '🌙',
    colors: {
      bg: '#0f172a',
      bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      primary: '#a78bfa',
      secondary: '#f472b6',
      accent: '#60a5fa',
      cardBg: '#1e293b',
      navBg: '#1e293b',
      border: '#334155',
      shadow: 'shadow-2xl shadow-purple-900/50',
    }
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    colors: {
      bg: '#f0f9ff',
      bgGradient: 'from-cyan-50 via-blue-50 to-indigo-50',
      text: '#0c4a6e',
      textSecondary: '#475569',
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#3b82f6',
      cardBg: '#ffffff',
      navBg: '#ffffff',
      border: '#bae6fd',
      shadow: 'shadow-lg shadow-cyan-200/50',
    }
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    colors: {
      bg: '#fff7ed',
      bgGradient: 'from-orange-50 via-red-50 to-pink-50',
      text: '#7c2d12',
      textSecondary: '#78716c',
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#ec4899',
      cardBg: '#ffffff',
      navBg: '#ffffff',
      border: '#fed7aa',
      shadow: 'shadow-lg shadow-orange-200/50',
    }
  },
  forest: {
    name: 'Forest',
    icon: '🌲',
    colors: {
      bg: '#f0fdf4',
      bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
      text: '#064e3b',
      textSecondary: '#475569',
      primary: '#10b981',
      secondary: '#14b8a6',
      accent: '#059669',
      cardBg: '#ffffff',
      navBg: '#ffffff',
      border: '#bbf7d0',
      shadow: 'shadow-lg shadow-emerald-200/50',
    }
  },
  midnight: {
    name: 'Midnight',
    icon: '🌃',
    colors: {
      bg: '#0a0a1a',
      bgGradient: 'from-indigo-950 via-purple-950 to-pink-950',
      text: '#e0e7ff',
      textSecondary: '#a5b4fc',
      primary: '#818cf8',
      secondary: '#c084fc',
      accent: '#f0abfc',
      cardBg: '#1e1e3f',
      navBg: '#1e1e3f',
      border: '#4c1d95',
      shadow: 'shadow-2xl shadow-purple-900/80',
    }
  },
  rose: {
    name: 'Rose Gold',
    icon: '🌹',
    colors: {
      bg: '#fef2f2',
      bgGradient: 'from-pink-50 via-rose-50 to-red-50',
      text: '#881337',
      textSecondary: '#78716c',
      primary: '#f43f5e',
      secondary: '#ec4899',
      accent: '#fb7185',
      cardBg: '#ffffff',
      navBg: '#ffffff',
      border: '#fecdd3',
      shadow: 'shadow-lg shadow-rose-200/50',
    }
  },
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'EUR';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // API Key State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('apiKey') || null;
  });

  const [isApiKeyValid, setIsApiKeyValid] = useState(() => {
    return !!localStorage.getItem('apiKey');
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme to document root for global styling
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle API Key validation
  const validateApiKey = (key) => {
    setApiKey(key);
    setIsApiKeyValid(true);
    localStorage.setItem('apiKey', key);
  };

  // Handle API Key removal/logout
  const removeApiKey = () => {
    setApiKey(null);
    setIsApiKeyValid(false);
    localStorage.removeItem('apiKey');
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const formatPrice = (price) => {
    const currencyInfo = currencyRates[currency];
    const convertedPrice = price * currencyInfo.rate;
    
    if (currency === 'JPY' || currency === 'CNY' || currency === 'INR') {
      return `${currencyInfo.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    setTheme,
    apiKey,
    isApiKeyValid,
    validateApiKey,
    removeApiKey,
    t,
    formatPrice,
    availableLanguages: Object.keys(translations),
    availableCurrencies: Object.keys(currencyRates),
    availableThemes: Object.keys(themes),
    currencyRates,
    themes,
    currentTheme: themes[theme],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
