'use strict';
const { MONGO_BRANDS_COLLECTION } = process.env;
const { v4: uuidv4 } = require('uuid');

module.exports = async function (fastify, opts) {
  const db = fastify.mongo.db.collection(MONGO_BRANDS_COLLECTION);
  const { notFound, badRequest } = fastify.httpErrors;

  fastify.get(
    '/brands',
    {
      schema: {
        response: {
          200: { $ref: 'getAllBrandsSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      try {
        const allBrands = await db.find({}).sort({ date: -1 }).toArray();
        reply.send(allBrands);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.get(
    '/brand/:id',
    {
      schema: {
        params: { $ref: 'paramsSchema' },
        response: {
          200: { $ref: 'brandRecordSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        if (!id) throw badRequest('Missing id param');
        const brand = await db.findOne({ id });
        reply.send(brand);
      } catch (error) {
        if (error.message === `Cannot read property 'id' of null`)
          throw notFound('Brand not found');
        throw error;
      }
    },
  );

  fastify.get(
    '/brand/find',
    {
      schema: {
        querystring: { $ref: 'querystringSchema' },
        response: {
          200: { $ref: 'getAllBrandsSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { q } = request.query;
      try {
        if (!q) throw badRequest('Missing querystring');
        const brands = await db.find({ $text: { $search: q } }).toArray();
        reply.send(brands);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.post(
    '/brand',
    {
      schema: {
        body: { $ref: 'addBrandBodySchema' },
        response: {
          201: { $ref: 'addBrandResSchema' },
          '4xx': { $ref: '4xxRes' },
        },
      },
    },
    async (request, reply) => {
      const { data } = request.body;
      const id = uuidv4();
      try {
        await db.insertOne({ id, date: fastify.currentDate(), ...data });
        reply.code(201).send({ id });
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.put(
    '/brand/:id',
    {
      schema: {
        params: { $ref: 'paramsSchema' },
        body: { $ref: 'addBrandBodySchema' },
        response: { 204: { $ref: '204Res' }, '4xx': { $ref: '4xxRes' } },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { data } = request.body;
      const brandUpdate = {
        $set: {
          date: fastify.currentDate(),
          brand: data.brand,
          description: data.description,
          number_of_models: data.number_of_models,
        },
      };
      try {
        if (!id) throw badRequest('Missing id param');
        const { result } = await db.updateOne({ id }, brandUpdate);
        if (result.n === 0) throw notFound('Brand not found');
        reply.code(204);
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.delete(
    '/brand/:id',
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
        if (result.n === 0) throw notFound('Brand not found');
        reply.code(204);
      } catch (error) {
        throw error;
      }
    },
  );
};
