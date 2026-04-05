import {db} from "../db";
import {matches, type NewMatch} from "../schema";
import {desc, eq} from "drizzle-orm";
import {createLiveInput} from "../config/cloudflare.ts";
import {handleError} from "../utils/handle-error.ts";

export const getMatches =  async () => {
   try {
       return db.select().from(matches).orderBy(desc(matches.createdAt));
   } catch (error) {
       return handleError("Failed fetch matches", 500, error as Error);
   }
}

export const goLive = async ({ params }:{ params: any }) => {
    try {
        const matchId = params.id;

        // Verify match exists first
        const [existingMatch] = await db.select()
            .from(matches)
            .where(eq(matches.id, matchId))
            .limit(1);

        if (!existingMatch) {
            return handleError("Match not found", 404);
        }

        // Initialize Cloudflare Stream
        const streamData = await createLiveInput(existingMatch.title || `Match-${matchId}`);

        // Update DB using explicit mapping (safer than spread)
        await db.update(matches)
            .set({
                status: 'live',
                cloudflareInputId: streamData.uid,
                streamKey: streamData.streamKey,
                rtmpsUrl: streamData.rtmpsUrl,
                playbackUrl: streamData.playbackUrl,
                lastModified: new Date()
            })
            .where(eq(matches.id, matchId));

        return {
            message: "Stream initialized",
            stream_url: streamData.rtmpsUrl,
            stream_key: streamData.streamKey,
            viewer_url: streamData.playbackUrl
        };

    } catch (error) {
        return handleError("Failed to go live", 500, error as Error);
    }
}

export const createMatch = async ({ body }: { body: NewMatch }) => {
    try {
        const { title, description, scheduledAt } = body;

        const [newMatch] = await db.insert(matches).values({
            title,
            description: description ?? "",
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            status: 'scheduled',
            createdAt: new Date(),
        }).returning();

        return {
            message: "Match created successfully",
            data: newMatch
        };
    } catch (error) {
        return handleError("Failed to create match", 500, error as Error);
    }
};