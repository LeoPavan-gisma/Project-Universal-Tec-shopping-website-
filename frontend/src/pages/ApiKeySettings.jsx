import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Key, CheckCircle, AlertCircle, Copy, RefreshCw } from 'lucide-react';

const ApiKeySettings = () => {
  const { apiKey, removeApiKey, currentTheme } = useApp();
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskKey = (key) => {
    if (!key) return 'No key set';
    if (showFullKey) return key;
    return `${key.substring(0, 8)}${'•'.repeat(Math.min(key.length - 8, 16))}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveKey = () => {
    if (window.confirm('Are you sure you want to remove your API key? You will need to re-enter it to access the site.')) {
      removeApiKey();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.bg }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
            <Shield className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
            API Key Settings
          </h1>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            Manage your API key for secure access
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl shadow-xl p-8 mb-6" style={{ backgroundColor: currentTheme.colors.cardBg }}>
          {/* Current Key Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h2 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                Your Current API Key
              </h2>
            </div>
            
            <div className="relative">
              <div className="font-mono text-lg p-4 rounded-lg border-2" style={{ 
                backgroundColor: currentTheme.colors.bg,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}>
                {maskKey(apiKey)}
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowFullKey(!showFullKey)}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {showFullKey ? '🔒 Hide Key' : '👁️ Show Key'}
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center gap-2"
                  style={{ 
                    backgroundColor: copied ? '#10b981' : currentTheme.colors.secondary,
                    color: '#ffffff'
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-8 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">API Key Active</p>
              <p className="text-sm text-green-700 mt-1">
                Your API key is valid and all requests are authenticated.
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="mb-8">
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
              <Shield className="w-5 h-5" />
              Security Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  Your API key is stored securely in your browser's local storage
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  All API requests are validated server-side for maximum security
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  Your key is automatically included in all API requests
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  Remove your key at any time to revoke access
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <h3 className="font-bold mb-3" style={{ color: currentTheme.colors.text }}>
              Actions
            </h3>
            <button
              onClick={handleRemoveKey}
              className="w-full px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            >
              <RefreshCw className="w-5 h-5" />
              Remove API Key & Re-authenticate
            </button>
            <p className="text-sm text-center mt-2" style={{ color: currentTheme.colors.textSecondary }}>
              You'll be asked to enter your API key again
            </p>
          </div>
        </div>

        {/* Help Card */}
        <div className="rounded-xl p-6" style={{ 
          backgroundColor: currentTheme.colors.primary + '10',
          borderLeft: `4px solid ${currentTheme.colors.primary}`
        }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
            <div>
              <h4 className="font-bold mb-1" style={{ color: currentTheme.colors.text }}>
                Need Help?
              </h4>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                If you're experiencing issues with your API key, try removing it and entering it again. 
                For production keys, contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
