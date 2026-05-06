-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Album" (
    "album_id" TEXT NOT NULL PRIMARY KEY,
    "city_name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "UserAlbum" (
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "albumId"),
    CONSTRAINT "UserAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "image_id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("album_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
