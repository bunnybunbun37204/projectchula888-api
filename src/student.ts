import { Hono } from "hono";
import { PrismaClient, Student } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { HTTPException } from "hono/http-exception";

type Binding = {
  DB: D1Database;
};

const student = new Hono<{ Bindings: Binding }>();

student.get("/count", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    const count = await prisma.student.count();
    return c.json({ count });
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

student.get("/:id", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const id = Number.parseInt(c.req.param("id"));

  try {
    const data = await prisma.student.findMany({
      where: {
        Student_id: id,
      },
    });
    return c.json({ data });
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

student.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();
  try {
    await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        major: data.major,
      },
    });
    return c.json({ message: "User create" }, 200);
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

student.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();
  try {
    await prisma.student.update({
      where: {
        Student_id: data.Student_id,
      },
      data: {
        name: data.name,
        email: data.email,
        major: data.major,
      },
    });
    return c.json({ message: "Update success" });
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

student.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();
  try {
    await prisma.student.delete({
      where: {
        Student_id: data.Student_id,
      },
    });
    return c.json({ message: "Delete success" });
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

export default student;
