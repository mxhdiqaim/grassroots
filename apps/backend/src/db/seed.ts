import {db} from "./index.ts";
import {matches, type NewMatch} from "../schema/match-schema.ts";


async function seed() {
    const newMatch = await db.insert(matches).values({
        title: "Lekki FC vs Ajah United",
        status: "scheduled"
    }).returning();

    console.log("✅ Created Test Match:");
    console.table(newMatch);
    console.log("Copy this ID for the next step:", (newMatch[0] as NewMatch).id);
}

seed();