import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { getEnvVariable } from "./utils";
import {matchRoutes} from "./routes/match.ts";

const NODE_ENV = getEnvVariable("NODE_ENV");
const LANDING_PAGE = getEnvVariable("LANDING_PAGE");
const APP_URL = getEnvVariable("APP_URL");

export const app = new Elysia()
    // .use(rateLimiter)
    // .onRequest(({ rateLimiter, ip, set, status }) => {
    //     if (rateLimiter.check(ip)) return status(420, 'Enhance your calm')
    // })

    // Built-in Swagger (Replaces manual API docs)
    .use(swagger())

    // Performance-optimised CORS
    .use(cors({
        origin: NODE_ENV === "development"
            ? [/localhost:300[0-2]/, /localhost:550[0-2]/] // Allow local dev ports
            : [LANDING_PAGE, APP_URL],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }))

    // Static Files (Replaces express.static)
    .use(staticPlugin({
        assets: 'public',
        prefix: '/public'
    }))

    // Global State & Context (Replaces custom req/res mutation)
    .derive(({ headers }) => {
        return {
            authorization: headers['authorization']
        };
    })

    // Your API Routes
    .group('/api/v1', (app) =>
        app.use(matchRoutes)
        // .use(userRoutes) // You can add more plugins here
    )

    // Global Error Handling
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return { message: "Route not found" };
        }
        console.error(error);
        return { message: "Internal server error" };
    });