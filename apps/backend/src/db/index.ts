import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import {getEnvVariable} from "../utils";

const connectionString = getEnvVariable("DATABASE_URL");

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

export const connect = async () => {
    try {
        await client`SELECT 1`;
        console.log("🐘 Postgres database connected.");
    } catch (error) {
        console.error("❌ Postgres connection failed:", error);
        throw error;
    }
};