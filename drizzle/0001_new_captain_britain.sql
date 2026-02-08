CREATE TABLE `adminSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminCode` varchar(64) NOT NULL,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#000000',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#FFFFFF',
	`accentColor` varchar(7) NOT NULL DEFAULT '#FF0000',
	`siteTitle` varchar(255) NOT NULL DEFAULT 'Painel Premium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `balanceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('entrada','saida') NOT NULL,
	`description` varchar(255) NOT NULL,
	`pixKey` varchar(255),
	`status` enum('pendente','concluido','cancelado') NOT NULL DEFAULT 'concluido',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `balanceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customButtons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`buttonName` varchar(255) NOT NULL,
	`buttonLabel` varchar(255) NOT NULL,
	`buttonIcon` varchar(64) NOT NULL DEFAULT 'Square',
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customButtons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBalance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userBalance_id` PRIMARY KEY(`id`),
	CONSTRAINT `userBalance_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `adminSettings` ADD CONSTRAINT `adminSettings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `balanceHistory` ADD CONSTRAINT `balanceHistory_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customButtons` ADD CONSTRAINT `customButtons_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBalance` ADD CONSTRAINT `userBalance_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;