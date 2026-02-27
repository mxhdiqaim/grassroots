import { Elysia, t } from 'elysia';
import db from '../db';
import { eq } from 'drizzle-orm';
import { createLiveInput } from '../services/cloudflare';
import { matches } from "../schema/match-schema.ts";

// This is a "Plugin". It can be used by the main app.
export const matchRoutes = new Elysia({ prefix: '/matches' })
    .get('/', async () => {
        return await db.select().from(matches);
    })

    .post('/:id/go-live', async ({ params }) => {
        const matchId = Number(params.id);

        // Check if a match exists
        const [match] = await db.select().from(matches).where(eq(matches.id, matchId));
        if (!match) return new Error( 'Match not found')

        // Call Cloudflare (Service we discussed)
        const input = await createLiveInput(match.title);

        // Update DB
        await db.update(matches)
            .set({
                cloudflareInputId: input.uid,
                streamKey: input.streamKey,
                rtmpsUrl: input.rtmpsUrl,
                playbackUrl: input.playbackUrl,
                status: 'live'
            })
            .where(eq(matches.id, matchId));

        return {
            stream_url: input.rtmpsUrl,
            stream_key: input.streamKey
        };
    }, {
        // Built-in validation replaces 'express-validator' or manual checks
        params: t.Object({
            id: t.String()
        })
    })
    .onRequest(({ set }) => {
        set.status = 401
        return { message: 'Unauthorized' }
    })
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') return set.status = 404, { error }
        // another custom handling
    })