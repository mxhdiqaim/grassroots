import { Elysia, t, status } from 'elysia';
import { eq, desc } from 'drizzle-orm';
import { createLiveInput } from '../services/cloudflare';
import { db } from "../db";
import {matches} from "../schema/match-schema.ts";

export const matchRoutes = new Elysia({ prefix: '/matches' })
    // optional global error logger
    .onError(({ code }) => {
        if (code === 500) return 'Server Error'
    })

    .get('/', async () => {
        return db.select().from(matches).orderBy(desc(matches.createdAt));
    })

    .post('/:id/go-live', async ({ params }) => {
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
    }, {
        params: t.Object({
            id: t.String() // Matches your UUIDv7 string format
        })
    });