export type Binding = {
  DB: D1Database;
  KV: KVNamespace;
  DeeAppId: string;
  DeeAppSecret: string;
  UPSTASH_REDIS_REST_TOKEN:string;
  UPSTASH_REDIS_REST_URL:string;
};

export interface ProjectWithStudentsAndAdvisors {
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  status: string;
  studentIds: string[]; // Assuming student IDs are numbers
  advisorIds: string[]; // Assuming advisor IDs are numbers
}

export interface UserData {
  firstname: string;
  lastname: string;
  ouid: string;
  username: string;
  gecos: string;
  email: string;
  disable: boolean;
  roles: string[];
  firstnameth: string;
  lastnameth: string;
}

export interface cacheUserData {
  fname: string,
  lname: string,
  id: string,
  email: string,
  role: string,
  faculty: string
}

export interface ProjectQ {
  project_id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  students: { student_id: string, project_id: number }[];
  advisors: { advisor_id: string, project_id: number }[];
}
