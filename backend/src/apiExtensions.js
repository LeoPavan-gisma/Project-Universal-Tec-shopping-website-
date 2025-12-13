// Utility to register additional API routes (AI, payments)
module.exports = function registerApiExtensions(app) {
  try {
    const ai = require('./routes/ai')
    const payments = require('./routes/payments')
    app.use('/api/ai', ai)
    app.use('/api/payments', payments)
    console.log('API extensions mounted: /api/ai, /api/payments')
  } catch (err) {
    console.warn('Could not mount API extensions:', err.message)
  }
}
