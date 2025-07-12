ALTER TABLE `account` ADD `account_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `provider_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `account` ADD `access_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `id_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `access_token_expires_at` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token_expires_at` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `accountId`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `providerId`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `accessToken`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `refreshToken`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `idToken`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `accessTokenExpiresAt`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `refreshTokenExpiresAt`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `session` ADD `expires_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `ip_address` text;--> statement-breakpoint
ALTER TABLE `session` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `session` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `expiresAt`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `ipAddress`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `userAgent`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `user` ADD `email_verified` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `emailVerified`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `verification` ADD `expires_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `verification` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `verification` DROP COLUMN `expiresAt`;--> statement-breakpoint
ALTER TABLE `verification` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `verification` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `location` ADD `user_id` integer NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `location` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `location` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `location` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `location` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `location` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `locationLog` ADD `started_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLog` ADD `ended_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLog` ADD `location_id` integer NOT NULL REFERENCES location(id);--> statement-breakpoint
ALTER TABLE `locationLog` ADD `user_id` integer NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `locationLog` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLog` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `startedAt`;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `endedAt`;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `locationId`;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `locationLog` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `locationLogImage` ADD `location_log_id` integer NOT NULL REFERENCES locationLog(id);--> statement-breakpoint
ALTER TABLE `locationLogImage` ADD `user_id` integer NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `locationLogImage` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLogImage` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `locationLogImage` DROP COLUMN `locationLogId`;--> statement-breakpoint
ALTER TABLE `locationLogImage` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `locationLogImage` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `locationLogImage` DROP COLUMN `updatedAt`;