'use strict';
const fp = require('fastify-plugin');
const proxy = require('fastify-http-proxy');
const { BRANDS_URL, CARS_URL } = process.env;

module.exports = fp(async (fastify, opts) => {
  fastify.register(proxy, {
    upstream: BRANDS_URL,
    prefix: '/api-brands',
  });

  fastify.register(proxy, {
    upstream: CARS_URL,
    prefix: '/api-cars',
  });
});
