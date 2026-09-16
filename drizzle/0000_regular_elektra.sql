CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`report_type` text NOT NULL,
	`detail` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
