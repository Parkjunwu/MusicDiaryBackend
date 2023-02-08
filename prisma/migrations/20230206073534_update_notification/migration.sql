-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `boardId` INTEGER NULL,
    ADD COLUMN `commentId` INTEGER NULL,
    ADD COLUMN `commentOfCommentId` INTEGER NULL;
