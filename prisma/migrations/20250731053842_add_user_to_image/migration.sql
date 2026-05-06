/*
  Warnings:

  - Added the required column `user_id` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
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
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Image_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("album_id", "created_at", "filter", "image_id", "is_deleted", "url") SELECT "album_id", "created_at", "filter", "image_id", "is_deleted", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
