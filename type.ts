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
  studentIds: String[]; // Assuming student IDs are numbers
  advisorIds: String[]; // Assuming advisor IDs are numbers
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
