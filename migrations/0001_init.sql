-- CreateTable
CREATE TABLE "Student" (
    "Student_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "major" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "Project_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "advisors" (
    "advisors_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Project_Student_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("Student_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_Student_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("Project_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project_advisor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advisorId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Project_advisor_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "advisors" ("advisors_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_advisor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("Project_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "advisors_email_key" ON "advisors"("email");

