import {db} from "../db";
import {sql} from "drizzle-orm";
import {Elysia} from "elysia";
import {matchRoutes} from "./match";

export const routes = new Elysia()
    .get("/health", async () => {
        try {
            await db.run(sql`SELECT 1`);
            return {
                status: "healthy",
                database: "connected",
                uptime: `${Math.floor(process.uptime())}s`,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: "unhealthy",
                database: "disconnected",
                error: "Database check failed"
            };
        }
    })
    .use(matchRoutes);