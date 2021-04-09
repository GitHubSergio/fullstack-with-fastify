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
    $id: 'carRecordSchema',
    type: 'object',
    required: [
      'id',
      'date',
      'model',
      'brand',
      'miles',
      'description',
      'overview',
    ],
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      model: { type: 'string' },
      brand: { type: 'string' },
      miles: { type: 'string' },
      description: { type: 'string' },
      overview: {
        type: 'object',
        required: ['gearbox', 'doors', 'fuel', 'seats'],
        additionalProperties: false,
        properties: {
          gearbox: { type: 'string' },
          doors: { type: 'string' },
          fuel: { type: 'string' },
          seats: { type: 'string' },
        },
      },
    },
  });

  fastify.addSchema({
    $id: 'getAllCarsSchema',
    type: 'array',
    items: { $ref: 'carRecordSchema' },
  });

  fastify.addSchema({
    $id: 'addCarBodySchema',
    type: 'object',
    required: ['data'],
    additionalProperties: false,
    properties: {
      data: {
        type: 'object',
        required: ['model', 'brand', 'miles', 'description', 'overview'],
        additionalProperties: false,
        properties: {
          model: { type: 'string' },
          brand: { type: 'string' },
          miles: { type: 'string' },
          description: { type: 'string' },
          overview: {
            type: 'object',
            required: ['gearbox', 'doors', 'fuel', 'seats'],
            additionalProperties: false,
            properties: {
              gearbox: { type: 'string' },
              doors: { type: 'string' },
              fuel: { type: 'string' },
              seats: { type: 'string' },
            },
          },
        },
      },
    },
  });

  fastify.addSchema({
    $id: 'addCarResSchema',
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
