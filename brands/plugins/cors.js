'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts) => {
  fastify.register(require('fastify-cors'), {
    origin: ['http://localhost:3000'],
  });
});
