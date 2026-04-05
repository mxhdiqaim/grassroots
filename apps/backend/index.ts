import { app } from "./src/server";
import {getEnvVariable} from "./src/utils";
import {connect} from "./src/db";

const PORT = parseInt(getEnvVariable("PORT"));

(async () => {
    // DB Connection using your existing logic
    try {
        await connect();
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