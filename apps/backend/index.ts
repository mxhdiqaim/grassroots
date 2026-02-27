import { app } from "./src/server";
import * as db from "./src/db";
import {getEnvVariable} from "./src/utils";

const PORT = parseInt(getEnvVariable("PORT"));

(async () => {
    // DB Connection using your existing logic
    try {
        await db.connect();
        console.log("✅ Database connection established");
    } catch (err) {
        console.error("❌ Database connection failed", err);
        process.exit(1);
    }

    // Start Elysia
    app.listen(PORT, () => {
        console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
    });
})()