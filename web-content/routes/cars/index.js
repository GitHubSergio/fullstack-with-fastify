'use strict';
const got = require('got');
const { API_URL } = process.env;

module.exports = async function (fastify, opts) {
  const { notFound, badRequest } = fastify.httpErrors;

  fastify.get('/', async function (request, reply) {
    try {
      const cars = await got(`${API_URL}/api-cars/cars`).json();
      return reply.view('cars.hbs', { page_title: 'Cars Page', cars });
    } catch (error) {
      if (!error.response) throw error;
      if (error.response.statusCode === 404) throw notFound();
      if (error.response.statusCode === 400) throw badRequest();
      throw error;
    }
  });

  fastify.get('/form-car', async function (request, reply) {
    try {
      return reply.view('add_car_form.hbs', { page_title: 'Add Car Page' });
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/find', async (request, reply) => {
    return reply.view('find_by_car_form.hbs');
  });

  fastify.post('/car/find', async (request, reply) => {
    const { car } = request.body;
    const cars = await got(`${API_URL}/api-cars/car/find?q=${car}`).json();
    return reply.view('find_by_car_form.hbs', { cars });
  });

  fastify.post('/', async (request, reply) => {
    const {
      model,
      brand,
      miles,
      description,
      gearbox,
      doors,
      fuel,
      seats,
    } = request.body;
    try {
      await got.post(`${API_URL}/api-cars/car`, {
        json: {
          data: {
            model,
            brand,
            miles,
            description,
            overview: {
              gearbox,
              doors,
              fuel,
              seats,
            },
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
