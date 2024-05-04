import { Hono } from "hono";
import { Binding, ProjectWithStudentsAndAdvisors } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project = new Hono<{ Bindings: Binding }>();

project.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const result = await prisma.project.findMany();
  return c.json({ result });
});

project.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<ProjectWithStudentsAndAdvisors>();
  const studentIds = data.studentIds;
  const advisorIds = data.advisorIds;
  const number = await prisma.project.count();

  let advisorData: { advisor_id: string; project_id: number }[] = [];
  let studentData: { student_id: string; project_id: number }[] = [];

  advisorIds.map((id) => {
    advisorData.push({ advisor_id: id.toString(), project_id: number + 1 });
  });

  studentIds.map((id) => {
    studentData.push({ student_id: id.toString(), project_id: number + 1 });
  });

  console.log(advisorData);
  console.log(studentData);

  await prisma.$transaction([
    prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    }),
    prisma.project_advisor.createMany({
      data: advisorData,
    }),
    prisma.project_Student.createMany({
      data: studentData,
    }),
  ]);

  return c.json({ message: "Create Project success" });
});

project.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();

  await prisma.project.update({
    where: {
      project_id: data.project_id,
    },
    data: data,
  });

  return c.json({ message: "Update success" });
});

project.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();

  await prisma.project.delete({
    where: {
      project_id: data.project_id,
    },
  });
  return c.json({ message: "Update success" });
});

project.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

export default project;
