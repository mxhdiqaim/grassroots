// import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {migrate} from "drizzle-orm/bun-sql/migrator";
import {db} from "./index.ts";

async function runMigration() {
    console.log("⏳ Running migrations...");

    try {
        migrate(db, {migrationsFolder: "./migration"});
        console.log("✅ Migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

runMigration();