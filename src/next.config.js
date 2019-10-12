const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => ({
  env: {
    ENVIRONMENT: phase === PHASE_DEVELOPMENT_SERVER ? 'development' : 'production'
  },
  // from https://github.com/zeit/next.js/tree/canary/examples/with-polyfills
  webpack: function(cfg) {
    const originalEntry = cfg.entry
    cfg.entry = async () => {
      const entries = await originalEntry()

      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js')
      }

      return entries
    }

    return cfg
  },
  target: 'serverless'
})
