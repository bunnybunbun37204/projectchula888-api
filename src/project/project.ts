import { Hono } from "hono";
import { Binding, ProjectWithStudentsAndAdvisors } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project = new Hono<{ Bindings: Binding }>();

project.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const student = c.req.queries("student") || [];
  const advisor = c.req.queries("advisor") || [];
  const startDateString = c.req.query("start") as string | undefined;
  const endDateString = c.req.query("end") as string | undefined;

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (startDateString) {
    startDate = new Date(startDateString);
    startDate.setUTCHours(0, 0, 0, 0);
  }

  if (endDateString) {
    endDate = new Date(endDateString);
    endDate.setUTCHours(0, 0, 0, 0);
  }

  const where = {
    students:
      student.length > 1
        ? { every: { student_id: { in: student } } }
        : student.length !== 0
        ? { some: { student_id: { in: student } } }
        : undefined,
    advisors:
      advisor.length > 1
        ? { every: { advisor_id: { in: advisor } } }
        : advisor.length !== 0
        ? { some: { advisor_id: { in: advisor } } }
        : undefined,
    startDate: startDate ? { equals: startDate } : undefined,
    endDate: endDate ? { equals: endDate } : undefined,
  };

  const result = await prisma.project.findMany({
    where: where,
    include: {
      students: true,
      advisors: true,
    },
  });

  return c.json({ result });
});

project.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<ProjectWithStudentsAndAdvisors>();
  const studentIds = data.studentIds;
  const advisorIds = data.advisorIds;

  let advisorData: { advisor_id: string; project_id: number }[] = [];
  let studentData: { student_id: string; project_id: number }[] = [];

  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });
  const latestQuery = await prisma.project.findMany({
    orderBy: {
      project_id: "desc",
    },
    take: 1,
  });

  const number = latestQuery[0].project_id;

  advisorIds.map((id) => {
    advisorData.push({ advisor_id: id.toString(), project_id: number });
  });

  studentIds.map((id) => {
    studentData.push({ student_id: id.toString(), project_id: number });
  });

  await prisma.$transaction([
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

  await prisma.$transaction([
    prisma.project_advisor.deleteMany({
      where: {
        project_id: data.project_id,
      },
    }),
    prisma.project_Student.deleteMany({
      where: {
        project_id: data.project_id,
      },
    }),
    prisma.project.delete({
      where: {
        project_id: data.project_id,
      },
    }),
  ]);

  return c.json({ message: "Delete success" });
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
