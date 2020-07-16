const config = require('../config')
const http = require('../support/http')

const getRegistryDefinition = (accept = 'json') => {
  const { SWAGGERHUB_URL } = config.getConfig()
  console.log('Here!')
  return http({
    url: [SWAGGERHUB_URL, 'swagger.json'],
    accept: accept,
    userAgent: global.shUserAgent
  })
}

module.exports = {
  getRegistryDefinition,
}
