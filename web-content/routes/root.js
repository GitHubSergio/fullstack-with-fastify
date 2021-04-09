'use strict';

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    try {
      return reply.view('index.hbs', { page_title: 'Home Page' });
    } catch (error) {
      throw error;
    }
  });
};
