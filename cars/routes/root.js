'use strict';
const { MONGO_CARS_COLLECTION } = process.env;
const { v4: uuidv4 } = require('uuid');

module.exports = async function (fastify, opts) {
  const db = fastify.mongo.db.collection(MONGO_CARS_COLLECTION);
  const { notFound, badRequest } = fastify.httpErrors;

  fastify.get(
    '/cars',
    {
      schema: {
        response: {
          200: { $ref: 'getAllCarsSchema', '4xx': { $ref: '4xxRes' } },
        },
      },
    },
    async function (request, reply) {
      try {
        const allCars = await db.find({}).sort({ date: -1 }).toArray();
        reply.send(allCars);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.get(
    '/car/:id',
    {
      schema: {
        params: { $ref: 'paramsSchema' },
        response: {
          200: { $ref: 'carRecordSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        if (!id) throw badRequest('Missing id param');
        const car = await db.findOne({ id });
        reply.send(car);
      } catch (error) {
        if (error.message === `Cannot read property 'id' of null`)
          throw notFound('Car not found');
        throw error;
      }
    },
  );

  fastify.get(
    '/car/find',
    {
      schema: {
        querystring: { $ref: 'querystringSchema' },
        response: {
          200: { $ref: 'getAllCarsSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { q } = request.query;
      try {
        if (!q) throw badRequest('Missing querystring');
        const cars = await db.find({ $text: { $search: q } }).toArray();
        reply.send(cars);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.post(
    '/car',
    {
      schema: {
        body: { $ref: 'addCarBodySchema' },
        response: {
          200: { $ref: 'addCarResSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { data } = request.body;
      const id = uuidv4();
      try {
        await db.insertOne({ id, date: fastify.currentDate(), ...data });
        reply.send({ id });
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.put(
    '/car/:id',
    {
      schema: {
        params: { $ref: 'paramsSchema' },
        body: { $ref: 'addCarBodySchema' },
        response: { 204: { $ref: '204Res' }, '4xx': { $ref: '4xxRes' } },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { data } = request.body;
      const carUpdate = {
        $set: {
          date: fastify.currentDate(),
          model: data.model,
          brand: data.brand,
          miles: data.miles,
          description: data.description,
          overview: {
            gearbox: data.overview.gearbox,
            doors: data.overview.doors,
            fuel: data.overview.fuel,
            seats: data.overview.seats,
          },
        },
      };
      try {
        if (!id) throw badRequest('Missing id param');
        const { result } = await db.updateOne({ id }, carUpdate);
        if (result.n === 0) throw notFound('Car not found');
        reply.code(204);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.delete(
    '/car/:id',
    {
      schema: {
        params: { $ref: 'paramsSchema' },
        response: { 204: { $ref: '204Res' }, '4xx': { $ref: '4xxRes' } },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        if (!id) throw badRequest('Missing id param');
        const { result } = await db.deleteOne({ id });
        if (result.n === 0) throw notFound('Car not found');
        reply.code(204);
      } catch (error) {
        throw error;
      }
    },
  );
};
