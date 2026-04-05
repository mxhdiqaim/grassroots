import { Elysia, t } from 'elysia';
import {getMatches, goLive} from "../controller";

export const matchRoutes = new Elysia({ prefix: '/matches' })
    // optional global error logger
    .onError(({ code }) => {
        if (code === 500) return 'Server Error'
    })

    .get('/', getMatches)

    .post('/:id/go-live', goLive, {
        params: t.Object({
            id: t.String()
        })
    });