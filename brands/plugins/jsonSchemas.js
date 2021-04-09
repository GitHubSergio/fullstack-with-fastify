'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts) => {
  fastify.addSchema({
    $id: 'paramsSchema',
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'querystringSchema',
    type: 'object',
    required: ['q'],
    properties: { q: { type: 'string' } },
  });

  fastify.addSchema({
    $id: 'brandRecordSchema',
    type: 'object',
    required: ['id', 'date', 'brand', 'description', 'number_of_models'],
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      brand: { type: 'string' },
      description: { type: 'string' },
      number_of_models: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'getAllBrandsSchema',
    type: 'array',
    items: { $ref: 'brandRecordSchema' },
  });

  fastify.addSchema({
    $id: 'addBrandBodySchema',
    type: 'object',
    required: ['data'],
    additionalProperties: false,
    properties: {
      data: {
        type: 'object',
        required: ['brand', 'description', 'number_of_models'],
        additionalProperties: false,
        properties: {
          brand: { type: 'string' },
          description: { type: 'string' },
          number_of_models: { type: 'string' },
        },
      },
    },
  });

  fastify.addSchema({
    $id: 'addBrandResSchema',
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: '204Res',
    type: 'null',
  });

  fastify.addSchema({
    $id: '4xxRes',
    type: 'object',
    required: ['statusCode', 'error', 'message'],
    additionalProperties: false,
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' },
    },
  });
});
