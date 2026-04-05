import {pgTable, text, timestamp, pgEnum, uuid} from 'drizzle-orm/pg-core';
import {sql} from "drizzle-orm";

export const statusEnum = pgEnum('match_status', [
    "scheduled",
    "live",
    "ended"
]);

export const matches = pgTable('matches', {
    id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),

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

    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    lastModified: timestamp('last_modified', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;