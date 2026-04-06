import {pgTable, text, timestamp, pgEnum} from 'drizzle-orm/pg-core';
import {baseSchema} from "./base-schema";

export const statusEnum = pgEnum('match_status', [
    "scheduled",
    "live",
    "ended"
]);

export const matches = pgTable('matches', {
    ...baseSchema,

    title: text('title').notNull(),
    description: text('description'),

    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),

    status: statusEnum('status')
        .notNull()
        .default("scheduled"),

    streamKey: text('stream_key'),
    rtmpsUrl: text('rtmps_url'),
    cloudflareInputId: text('cloudflare_input_id'),
    playbackUrl: text('playback_url'),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;