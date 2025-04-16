'use strict'


const { DatabaseSync } = require('node:sqlite');

const database = new DatabaseSync(':memory:');

    database.exec(`
      CREATE TABLE categories(
        category_name TEXT,
        id INTEGER PRIMARY KEY
      )
    `);

    database.exec(`
        CREATE TABLE products(
          product_name TEXT,
          id INTEGER PRIMARY KEY,
          category_id INTEGER NOT NULL,
          description TEXT,
          price REAL,
          image_url TEXT,
          FOREIGN KEY(category_id) REFERENCES categories(id) 
        ) STRICT
      `);


const categoryData = database.prepare('INSERT INTO categories (category_name) VALUES (?)');
categoryData.run('furniture');
categoryData.run('eletronics');
categoryData.run('books');

const insertStatement = database.prepare('INSERT INTO products (product_name, category_id, description, price, image_url) VALUES (?, ?, ?, ?, ?)');
insertStatement.run('wood table', 1, 'retangular, 150 x 70cm, dark brown', 150, 'https://free-images.com/md/ecf2/wood_table_chairs_bench.jpg');
insertStatement.run('simple office chair', 1, 'no-wheels, dark grey', 40, 'https://free-images.com/md/79f7/chair_garden_green_hedge.jpg');
insertStatement.run('ergonomic office chair', 1, 'black', 80, 'https://free-images.com/md/b1c7/chair_office_table_workplace.jpg');


module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {

        const query = database.prepare('SELECT product_name, id, price, image_url FROM products')

        return query.all()

    })
  }