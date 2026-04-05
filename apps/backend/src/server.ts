import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { getEnvVariable } from "./utils";
import {logger} from "@bogeychan/elysia-logger";
import {routes} from "./routes";

const NODE_ENV = getEnvVariable("NODE_ENV");
const LANDING_PAGE = getEnvVariable("LANDING_PAGE");
const APP_URL = getEnvVariable("APP_URL");

export const app = new Elysia()
    .use(logger())
    .use(swagger())
    .use(cors({
        origin: NODE_ENV === "development" ? true : [LANDING_PAGE, APP_URL],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }))

    // Global State & Context (Replaces custom req/res mutation)
    .derive(({ headers }) => {
        return {
            authorization: headers['authorization']
        };
    })

    // Your API Routes
    .group('/api/v1', (app) => app.use(routes))

    // Global Error Handling
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return { message: "Route not found" };
        }
        console.error(error);
        return { message: "Internal server error" };
    });