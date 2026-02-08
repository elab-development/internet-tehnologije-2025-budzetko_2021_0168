/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `icon` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_userId_key` ON `Category`(`name`, `userId`);
