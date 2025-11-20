import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;
let connectionString;

switch (process.env.NODE_ENV) {
  case "dev":
    connectionString = process.env.DEV_DATABASE_URL;
    break;
  case "test":
    connectionString = process.env.TEST_DATABASE_URL;
    break;
  case "prod":
  default:
    connectionString = process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// search_pathin asetus ei ole tarpeen jos käytät public-schemaa
/*
pool.on("connect", (client) => {
  client.query("SET search_path TO libschema, public;").catch((err) => {
    console.error("Virhe search_pathin asettamisessa:", err);
  });
});
*/
export default pool;
