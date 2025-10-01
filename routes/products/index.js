"use strict";

const { DatabaseSync } = require("node:sqlite");
const { faker } = require("@faker-js/faker");
const { sortProducts } = require("../../utils/common.js");
const { paginate } = require("../../utils/common.js");

const database = new DatabaseSync(":memory:");

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
          slug TEXT NOT NULL UNIQUE,
          category_id INTEGER NOT NULL,
          description TEXT,
          condition TEXT,
          location TEXT,
          price REAL,
          image_url TEXT,
          FOREIGN KEY(category_id) REFERENCES categories(id) 
        ) STRICT
      `);

const categoryData = database.prepare(
    "INSERT INTO categories (category_name) VALUES (?)"
);
categoryData.run("furniture");
categoryData.run("eletronics");
categoryData.run("books");
categoryData.run("general");

const insertStatement = database.prepare(
    "INSERT INTO products (product_name, category_id, slug, description, condition, location, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
insertStatement.run(
    "wood table",
    1,
    "wood_table_12345",
    "retangular, 150 x 70cm, dark brown",
    "new",
    "São Paulo",
    150.5,
    "https://free-images.com/md/ecf2/wood_table_chairs_bench.jpg"
);
insertStatement.run(
    "simple office chair",
    1,
    "simple_office_chair_12345",
    "no-wheels, dark grey",
    "new",
    "Campinas",
    40.99,
    "https://free-images.com/md/79f7/chair_garden_green_hedge.jpg"
);
insertStatement.run(
    "ergonomic office chair",
    1,
    "ergonomic_office_chair_12345",
    "black",
    "semi-new",
    "São Paulo",
    80.0,
    "https://free-images.com/md/b1c7/chair_office_table_workplace.jpg"
);

for (let i = 0; i < 50; i++) {
    const pname = faker.commerce.product();
    const pslug = pname.replace(" ", "_");
    insertStatement.run(
        pname,
        4,
        `${pslug}_${faker.string.alphanumeric(5)}`,
        "",
        "",
        "",
        faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        ""
    );
}

module.exports = async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
        // destructuring
        const {
            search,
            page = "1",
            page_size = "10",
            sort = "name",
        } = request.query;
        console.log(request.query);

        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "*");

        const query = database.prepare(
            "SELECT product_name, slug, price, image_url, category_id FROM products"
        );

        const prod = sortProducts(
            query
                .all()
                .filter(
                    (product) =>
                        !search ||
                        product.product_name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                ),
            sort
        );

        const products = paginate(prod, page, page_size);
        const products_total = Object.keys(prod).length;
        const page_total = Math.ceil(products_total / Number(page_size));

        return {
            products: products,
            products_total: products_total,
            page_total: page_total,
            page: Number(page),
            sortOptions: [
                { value: "name", label: "ABC" },
                { value: "priceASC", label: "lowest price" },
                { value: "priceDSC", label: "highest price" },
            ],
        };
    });

    fastify.get("/:slug", async function (request, reply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "*");

        const { slug } = request.params;
        const query = database.prepare(
            "SELECT product_name, description, condition, location, category_id, price, image_url, category_name FROM products p INNER JOIN categories c on p.category_id = c.id WHERE slug = ?"
        );

        const product = query.get(slug);

        if (product) {
            return product;
        }

        reply.statusCode = 404;
    });
};
