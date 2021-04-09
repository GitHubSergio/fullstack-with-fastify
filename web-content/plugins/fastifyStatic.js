'use strict';
const { join } = require('path');
const fp = require('fastify-plugin');
const { NODE_ENV } = process.env;
const dev = NODE_ENV !== 'production';
const fastifyStatic = dev && require('fastify-static');

module.exports = fp(async (fastify, opts) => {
  if (dev) {
    fastify.register(fastifyStatic, {
      root: join(__dirname, '../public'),
    });
  }
});
