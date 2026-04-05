import { Elysia, t } from 'elysia';
import {createMatch, getMatches, goLive} from "../controller";

export const matchRoutes = new Elysia({ prefix: '/matches' })
    // optional global error logger
    .onError(({ code }) => {
        if (code === 500) return 'Server Error'
    })

    .get('/', getMatches)

    .post('/', createMatch, {
        body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            scheduledAt: t.Optional(t.String())
        })
    })

    .post('/:id/go-live', goLive, {
        params: t.Object({
            id: t.String()
        })
    });