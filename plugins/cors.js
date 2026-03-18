'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins adds CORS support
 *
 * @see https://github.com/fastify/fastify-cors
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/cors'), {
    origin: true // allow all origins for development
  })
})
