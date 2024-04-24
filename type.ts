import { Project_advisor, Student } from "@prisma/client";

export type Binding = {
  DB: D1Database;
};

export interface ProjectWithStudentsAndAdvisors {
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  status: string;
  studentIds: String[]; // Assuming student IDs are numbers
  advisorIds: String[]; // Assuming advisor IDs are numbers
}
