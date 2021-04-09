'use strict';
const got = require('got');
const { API_URL } = process.env;

module.exports = async function (fastify, opts) {
  const { notFound, badRequest } = fastify.httpErrors;

  fastify.get('/', async function (request, reply) {
    try {
      const brands = await got(`${API_URL}/api-brands/brands`).json();
      return reply.view('brands.hbs', { page_title: 'Brands Page', brands });
    } catch (error) {
      if (!error.response) throw error;
      if (error.response.statusCode === 404) throw notFound();
      if (error.response.statusCode === 400) throw badRequest();
      throw error;
    }
  });

  fastify.get('/form-brand', async function (request, reply) {
    try {
      return reply.view('add_brand_form.hbs', { page_title: 'Add Brand Page' });
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/find', async (request, reply) => {
    return reply.view('find_by_brand_form.hbs');
  });

  fastify.post('/brand/find', async (request, reply) => {
    const { brand } = request.body;
    const brands = await got(
      `${API_URL}/api-brands/brand/find?q=${brand}`,
    ).json();
    return reply.view('find_by_brand_form.hbs', { brands });
  });

  fastify.post('/', async (request, reply) => {
    const { brand, description, number_of_models } = request.body;
    try {
      await got.post(`${API_URL}/api-brands/brand`, {
        json: {
          data: {
            brand,
            description,
            number_of_models,
          },
        },
      });
      return reply.redirect('/');
    } catch (error) {
      if (!error.response) throw error;
      if (error.response.statusCode === 404) throw notFound();
      if (error.response.statusCode === 400) throw badRequest();
      throw error;
    }
  });
};
