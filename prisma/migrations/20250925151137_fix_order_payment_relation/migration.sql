/*
  Warnings:

  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_tourId_fkey`;

-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_userId_fkey`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `method`,
    ADD COLUMN `orderId` INTEGER NOT NULL,
    ADD COLUMN `provider` ENUM('STRIPE', 'MOMO') NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE `Booking`;

-- DropTable
DROP TABLE `Lesson`;

-- DropTable
DROP TABLE `Tour`;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('MINI_SPEAKER', 'NDGO_PROGRAM', 'TOUR') NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'usd',
    `location` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `scheduledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
