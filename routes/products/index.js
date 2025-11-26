"use strict";

const { sortProducts } = require("../../utils/common.js");
const { paginate } = require("../../utils/common.js");
require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

module.exports = async function (fastify, opts) {
    fastify.register(require("@fastify/mysql"), {
        promise: true,
        connectionString: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    });

    fastify.get("/", async function (request, reply) {
        const connection = await fastify.mysql.getConnection();

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

        const [rows] = await connection.query(
            `SELECT p.id, product_name, slug, price, category_id, url FROM products p
             JOIN (SELECT product_id,url FROM product_images i1 WHERE is_primary = true) i on i.product_id = p.id`
        );

        const prod = sortProducts(
            rows.filter(
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

        connection.release();

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

        const connection = await fastify.mysql.getConnection();
        const { slug } = request.params;
        const [[product]] = await connection.query(
            `SELECT p.id, product_name, description, product_condition, location, category_id, price, 
            category_name FROM products p INNER JOIN categories c on 
            p.category_id = c.id WHERE slug = ?`,
            [slug]
        );

        const [imgQuery] = await connection.query(
            `SELECT url FROM products p INNER JOIN product_images i on
            p.id = i.product_id WHERE p.id = ?`,
            [product.id]
        );

        product.images = imgQuery;

        connection.release();

        if (product) {
            return product;
        }

        reply.statusCode = 404;
    });

    fastify.get("/database", async function (request, reply) {
        const connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query("SELECT * FROM products");
        connection.release();
        return rows;
    });
};
