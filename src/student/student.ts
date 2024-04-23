import { Hono } from "hono";
import { PrismaClient, Student } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { HTTPException } from "hono/http-exception";
import { Binding } from "../../type";

const student = new Hono<{ Bindings: Binding }>();

student.get("/count", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.student.count();
  return c.json({ count });
});

student.get("/:id", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const id = c.req.param("id");

  const data = await prisma.student.findMany({
    where: {
      student_id: id,
    },
  });
  return c.json({ data });
});

student.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await prisma.student.findMany();
  return c.json({ data });
});

student.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();
  await prisma.student.create({
    data: {
      student_id: data.student_id,
      name: data.name,
      email: data.email,
      major: data.major,
    },
  });
  return c.json({ message: "User create" }, 200);
});

student.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();

  await prisma.student.update({
    where: {
      student_id: data.student_id,
    },
    data: {
      name: data.name,
      email: data.email,
      major: data.major,
    },
  });
  return c.json({ message: "Update success" });
});

student.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();

  await prisma.student.delete({
    where: {
      student_id: data.student_id,
    },
  });

  return c.json({ message: "Delete success" });
});

student.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

export default student;
