-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "columnId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("columnId", "createdAt", "description", "id", "position", "title", "updatedAt") SELECT "columnId", "createdAt", "description", "id", "position", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_title_columnId_key" ON "Task"("title", "columnId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
