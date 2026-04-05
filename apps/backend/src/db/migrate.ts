import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./";

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