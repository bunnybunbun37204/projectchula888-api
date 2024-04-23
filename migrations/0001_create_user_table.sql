-- CreateTable
CREATE TABLE "Student" (
    "student_id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "major" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Advisor" (
    "advisor_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    CONSTRAINT "Project_Student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student" ("student_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_Student_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("project_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project_advisor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advisor_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    CONSTRAINT "Project_advisor_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "Advisor" ("advisor_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_advisor_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("project_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");
