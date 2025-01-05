ALTER TABLE `page_content_library` RENAME TO `page_contents`;--> statement-breakpoint
DROP TABLE `page_content_placements`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_page_contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`content_id` text NOT NULL,
	`position_x` integer,
	`position_y` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_page_contents`("id", "page_id", "content_id", "position_x", "position_y", "created_at") SELECT "id", "page_id", "content_id", "position_x", "position_y", "created_at" FROM `page_contents`;--> statement-breakpoint
DROP TABLE `page_contents`;--> statement-breakpoint
ALTER TABLE `__new_page_contents` RENAME TO `page_contents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `page_contents_page_id_idx` ON `page_contents` (`page_id`);--> statement-breakpoint
CREATE INDEX `page_contents_content_id_idx` ON `page_contents` (`content_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `page_content_unique_idx` ON `page_contents` (`page_id`,`content_id`);