CREATE TABLE `contents` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`media_url` text,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`edit_id` text NOT NULL,
	`content_id` text NOT NULL,
	`x` integer,
	`y` integer,
	`z` integer,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`edit_id`) REFERENCES `pages`(`edit_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_contents_page_id_idx` ON `page_contents` (`page_id`);--> statement-breakpoint
CREATE INDEX `page_contents_edit_id_idx` ON `page_contents` (`edit_id`);--> statement-breakpoint
CREATE INDEX `page_contents_content_id_idx` ON `page_contents` (`content_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `page_content_unique_idx` ON `page_contents` (`page_id`,`content_id`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`edit_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `edit_id_idx` ON `pages` (`edit_id`);