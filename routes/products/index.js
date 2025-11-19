"use strict";

const { DatabaseSync } = require("node:sqlite");
const { faker } = require("@faker-js/faker");
const { sortProducts } = require("../../utils/common.js");
const { paginate } = require("../../utils/common.js");
const { url } = require("inspector");

module.exports = async function (fastify, opts) {
    fastify.register(require("@fastify/mysql"), {
        promise: true,
        connectionString:
            "mysql://admin:1q2w3e4r@products.cfg2mi06cdap.eu-north-1.rds.amazonaws.com:3306",
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
            `SELECT p.id, product_name, slug, price, category_id, url FROM ofertify.products p
             JOIN ofertify.product_images i on p.id = (SELECT i.product_id FROM ofertify.product_images LIMIT 1)`
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
            category_name FROM ofertify.products p INNER JOIN ofertify.categories c on 
            p.category_id = c.id WHERE slug = ?`,
            [slug]
        );

        const [imgQuery] = await connection.query(
            `SELECT url FROM ofertify.products p INNER JOIN ofertify.product_images i on
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
        const [rows] = await connection.query(
            "SELECT * FROM ofertify.products"
        );
        connection.release();
        return rows;
    });
};
