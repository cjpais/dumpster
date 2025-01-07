ALTER TABLE `page_contents` ADD `edit_id` text NOT NULL REFERENCES pages(edit_id);--> statement-breakpoint
CREATE INDEX `page_contents_edit_id_idx` ON `page_contents` (`edit_id`);