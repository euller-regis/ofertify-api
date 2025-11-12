import dotenv from "dotenv";
import Postgrator from "postgrator";
import mysql from "mysql";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function doMigration() {
    dotenv.config();
    // Create a client of your choice
    const client = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        // Establish a database connection
        await client.connect();
        // Create postgrator instance
        const postgrator = new Postgrator({
            migrationPattern: path.join(__dirname, "../migrations/*"),
            driver: "mysql",
            database: process.env.DB_NAME,
            schemaTable: "schemaversion",
            execQuery: (query) => {
                return new Promise((resolve, reject) => {
                    client.query(query, (err, rows, fields) => {
                        if (err) {
                            return reject(err);
                        }
                        const results = { rows, fields };
                        resolve(results);
                    });
                });
            },
        });

        const result = await postgrator.migrate();

        if (result.length === 0) {
            console.log(
                'No migrations run for schema "schemaversion". Already at the latest one.'
            );
        } else {
            console.log(result);
        }
    } catch (error) {
        console.log(error);
        // If error happened partially through migrations,
        // error object is decorated with appliedMigrations
        console.error(error.appliedMigrations); // array of migration objects
    }

    // Once done migrating, close your connection.
    await client.end();
}
doMigration();
