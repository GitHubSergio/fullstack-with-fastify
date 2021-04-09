'use strict';
const { join } = require('path');
const fp = require('fastify-plugin');
const pointOfView = require('point-of-view');
const handlebars = require('handlebars');

module.exports = fp(async (fastify, opts) => {
  fastify.register(pointOfView, {
    root: join(__dirname, '../views'),
    engine: { handlebars },
    layout: 'layout.hbs',
    options: {
      partials: {
        header: 'header.hbs',
        brands: 'brands.hbs',
        cars: 'cars.hbs',
      },
    },
  });
});
