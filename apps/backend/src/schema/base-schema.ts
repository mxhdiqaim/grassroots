import {sql} from "drizzle-orm";
import {timestamp, uuid} from 'drizzle-orm/pg-core';

// Define the fields every table must have
export const baseSchema = {
    id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),

    lastModified: timestamp('last_modified', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
};