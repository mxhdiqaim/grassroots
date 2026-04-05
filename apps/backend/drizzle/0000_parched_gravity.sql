CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`stream_key` text,
	`rtmps_url` text,
	`cloudflare_input_id` text,
	`playback_url` text,
	`created_at` integer DEFAULT '"2026-04-05T02:50:11.364Z"' NOT NULL,
	`last_modified` integer DEFAULT '"2026-04-05T02:50:11.364Z"' NOT NULL
);
