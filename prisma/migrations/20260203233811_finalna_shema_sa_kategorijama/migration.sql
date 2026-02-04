/*
  Warnings:

  - You are about to drop the column `icon` on the `category` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `savinggoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_userId_fkey`;

-- DropForeignKey
ALTER TABLE `income` DROP FOREIGN KEY `Income_userId_fkey`;

-- DropForeignKey
ALTER TABLE `savinggoal` DROP FOREIGN KEY `SavingGoal_userId_fkey`;

-- DropIndex
DROP INDEX `Category_name_key` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `icon`,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `type` ENUM('INCOME', 'EXPENSE') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'GUEST') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `savinggoal`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
