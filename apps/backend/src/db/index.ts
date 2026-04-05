import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getEnvVariable } from "../utils";

const connectionString = getEnvVariable("DATABASE_URL");
const sslRequired = getEnvVariable("DB_SSL_REQUIRED") === "true";

export const client = postgres(connectionString, {
    max: 10,
    ssl: sslRequired ? { rejectUnauthorized: false } : false,
    prepare: false,
});

export const db = drizzle(client, { schema });

export const connect = async () => {
    try {
        // A simple "ping" to ensure the credentials are correct
        await client`SELECT 1`;
        console.log("🐘 Postgres connection established");
    } catch (error) {
        console.error("❌ Postgres Connection Error:", error);
        throw error;
    }
};