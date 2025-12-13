import React, { useState } from 'react';
import { Shield, Lock, Key, AlertCircle, CheckCircle } from 'lucide-react';

const ApiKeyGate = ({ onValidate }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);

    try {
      // Test the API key by making a simple request
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?limit=1`, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        // API key is valid
        localStorage.setItem('apiKey', apiKey);
        onValidate(apiKey);
      } else if (response.status === 401 || response.status === 403) {
        const data = await response.json();
        setError(data.message || 'Invalid API key. Please check and try again.');
      } else {
        setError('Unable to validate API key. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const predefinedKeys = [
    { label: 'Default Key', value: 'UNIVERSAL_SHOP_2024_KEY' },
    { label: 'Development Key', value: 'DEV_KEY_12345' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Security Badge */}
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Shield className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Access Required</h1>
          <p className="text-indigo-100">Enter your API key to access Universal Shop</p>
        </div>

        {/* API Key Entry Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">API Authentication</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Key Input */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={isValidating}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            {/* Quick Select Keys */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm font-medium text-indigo-900 mb-3">Quick Select:</p>
              <div className="space-y-2">
                {predefinedKeys.map((key) => (
                  <button
                    key={key.value}
                    type="button"
                    onClick={() => setApiKey(key.value)}
                    className="w-full text-left px-3 py-2 bg-white rounded-md text-sm text-gray-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
                  >
                    <span className="font-medium">{key.label}</span>
                    <span className="text-gray-500 ml-2">({key.value.substring(0, 15)}...)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isValidating}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isValidating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Verify & Access
                </span>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                Your API key is stored locally and encrypted. It's used to authenticate your requests to our secure servers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Don't have an API key? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGate;
