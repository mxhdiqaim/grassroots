import { Elysia, t } from 'elysia';
import error from "elysia"
import { eq, desc } from 'drizzle-orm';
import { createLiveInput } from '../services/cloudflare';
import {matches} from "../schema/match-schema.ts";
import { db } from "../db";

export const matchRoutes = new Elysia({ prefix: '/matches' })
    .get('/', async () => {
        return db.select().from(matches).orderBy(desc(matches.createdAt));
    })

    .post('/:id/go-live', async ({ params }) => {
        try {
            const matchId = Number(params.id);

            // Optional: You should probably verify the match exists here first
            const streamData = await createLiveInput(`Match-ID-${matchId}`);

            // Update DB
            await db.update(matches)
                .set({
                    cloudflareInputId: streamData.uid,
                    streamKey: streamData.streamKey,
                    rtmpsUrl: streamData.rtmpsUrl,
                    playbackUrl: streamData.playbackUrl,
                    status: 'live'
                })
                .where(eq(matches.id, matchId)); // 3. Fixed the 'eq' logic

            return {
                message: "Stream initialized",
                stream_url: streamData.rtmpsUrl,
                stream_key: streamData.streamKey,
                viewer_url: streamData.playbackUrl
            };

        } catch (e) {
            console.error(e);
            return new error(500, "Failed to create stream"); // 4. This works now
        }
    }, {
        params: t.Object({
            id: t.String()
        })
    });