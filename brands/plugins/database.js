'use strict';
const fp = require('fastify-plugin');
const database = require('fastify-mongodb');
const { MONGO_URL } = process.env;

module.exports = fp(async (fastify, opts) => {
  fastify.register(database, {
    forceClose: true,
    url: MONGO_URL,
  });
});
