ALTER TABLE `page_contents` RENAME TO `page_content_library`;--> statement-breakpoint
CREATE TABLE `page_content_placements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`library_item_id` integer NOT NULL,
	`position_x` integer NOT NULL,
	`position_y` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`library_item_id`) REFERENCES `page_content_library`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_page_content_library` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`content_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_page_content_library`("id", "page_id", "content_id", "created_at") SELECT "id", "page_id", "content_id", "created_at" FROM `page_content_library`;--> statement-breakpoint
DROP TABLE `page_content_library`;--> statement-breakpoint
ALTER TABLE `__new_page_content_library` RENAME TO `page_content_library`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `page_library_page_id_idx` ON `page_content_library` (`page_id`);--> statement-breakpoint
CREATE INDEX `page_library_content_id_idx` ON `page_content_library` (`content_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `page_content_unique_idx` ON `page_content_library` (`page_id`,`content_id`);--> statement-breakpoint
CREATE TABLE `__new_contents` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`media_url` text,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contents`("id", "type", "content", "media_url", "metadata", "created_at") SELECT "id", "type", "content", "media_url", "metadata", "created_at" FROM `contents`;--> statement-breakpoint
DROP TABLE `contents`;--> statement-breakpoint
ALTER TABLE `__new_contents` RENAME TO `contents`;