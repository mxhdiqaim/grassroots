import {db} from "../db";
import {matches} from "../schema";
import {desc, eq} from "drizzle-orm";
import {status} from "elysia";
import {createLiveInput} from "../services/cloudflare.ts";

export const getMatches =  async () => {
    return db.select().from(matches).orderBy(desc(matches.createdAt));
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
            return status(404, { message: "Match not found in local database" });
        }

        // 2. Initialize Cloudflare Stream
        const streamData = await createLiveInput(existingMatch.title || `Match-${matchId}`);

        // 3. Update DB using explicit mapping (safer than spread)
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
        console.error("Streaming Error:", error);
        return status(500, { message: "Failed to communicate with Cloudflare" });
    }
}