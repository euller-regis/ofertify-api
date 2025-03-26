'use strict'

const { DatabaseSync } = require('node:sqlite');

const database = new DatabaseSync(':memory:');

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {

        const query = database.prepare('SELECT category_name, id FROM categories')

        return query.all()

    })
  }