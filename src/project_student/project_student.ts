import { Hono } from "hono";
import { Binding } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project_Student } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project_student = new Hono<{ Bindings: Binding }>();

project_student.get("/count", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.project_Student.count();
  return c.json({ count });
}); //Done

project_student.get("/:pjId", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const project_id = Number.parseInt(c.req.param("pjId"));

  const data = await prisma.project_Student.findMany({
    where: {
      project_id: project_id,
    },
  });
  return c.json({ data });
}); //Done

project_student.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await prisma.project_Student.findMany();
  return c.json({ data });
}); //Done

project_student.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project_Student>();
  await prisma.project_Student.create({
    data: {
      id: data.id,
      student_id: data.student_id,
      project_id: data.project_id,
    },
  });
  return c.json({ message: "Create success" }, 200);
}); //Done

project_student.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project_Student>();

  await prisma.project_Student.update({
    where: {
      id: data.id,
    },
    data: {
      student_id: data.student_id,
      project_id: data.project_id,
    },
  });
  return c.json({ message: "Update success" });
}); //Done but Should it update by using id?

project_student.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project_Student>();

  await prisma.project_Student.delete({
    where: {
      id: data.id,
    },
  });

  return c.json({ message: "Delete success" });
}); //Done but Should it dalete by using id?

project_student.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

export default project_student;
