import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './migration',
    schema: './src/schema',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'sqlite.db',
    },
    verbose: true,
    strict: true,
});