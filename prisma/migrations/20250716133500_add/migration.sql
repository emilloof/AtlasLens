/*
  Warnings:

  - You are about to drop the column `albumId` on the `Image` table. All the data in the column will be lost.
  - The primary key for the `UserAlbum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `albumId` on the `UserAlbum` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserAlbum` table. All the data in the column will be lost.
  - Added the required column `album_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `album_id` to the `UserAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserAlbum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "profile_image" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "writer_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_id" TEXT NOT NULL,
    "parent_id" TEXT,
    CONSTRAINT "Comment_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image" ("image_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment" ("comment_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Like" (
    "user_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "image_id"),
    CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image" ("image_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_id" TEXT,
    "comment_id" TEXT,
    CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "image_id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filter" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Image_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("created_at", "image_id", "url") SELECT "created_at", "image_id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_UserAlbum" (
    "user_id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,

    PRIMARY KEY ("user_id", "album_id"),
    CONSTRAINT "UserAlbum_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAlbum_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "UserAlbum";
ALTER TABLE "new_UserAlbum" RENAME TO "UserAlbum";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
