import { defineConfig } from 'drizzle-kit';
import {getEnvVariable} from "./src/utils";

const DATABASE_URL = getEnvVariable("DATABASE_URL");

export default defineConfig({
    out: './migration',
    schema: './src/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: DATABASE_URL,
    },
});