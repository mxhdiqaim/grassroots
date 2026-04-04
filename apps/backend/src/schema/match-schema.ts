import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { uuidv7 } from 'uuidv7';

export const MATCH_STATUS = ["scheduled", "live", "ended"] as const;
export type MatchStatus = typeof MATCH_STATUS[number];

export const matches = sqliteTable('matches', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),

    title: text('title').notNull(),

    status: text('status', { enum: MATCH_STATUS })
        .notNull()
        .default("scheduled"),

    streamKey: text('stream_key'),
    rtmpsUrl: text('rtmps_url'),
    cloudflareInputId: text('cloudflare_input_id'),
    playbackUrl: text('playback_url'),

    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(new Date()),

    lastModified: integer('last_modified', { mode: 'timestamp' })
        .notNull()
        .default(new Date())
        .$onUpdateFn(() => new Date()),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;