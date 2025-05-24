-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "image_id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("albumId", "image_id", "url") SELECT "albumId", "image_id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
