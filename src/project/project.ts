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

  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });
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
