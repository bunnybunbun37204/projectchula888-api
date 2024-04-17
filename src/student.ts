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
    throw new HTTPException(402, { cause: (e as Error).message });
  }
});

student.get("/student/:id", async (c) => {
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
    throw new HTTPException(402, { cause: (e as Error).message });
  }
});

student.post("/create", async (c) => {
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
    throw new HTTPException(402, { cause: (e as Error).message });
  }
});

student.patch("/update", async (c) => {
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
  } catch (e) {
    throw new HTTPException(402, { cause: (e as Error).message });
  }
});

student.delete("/delete", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Student>();
  try {
    await prisma.student.delete({
      where: {
        Student_id: data.Student_id,
      },
    });
  } catch (e) {
    throw new HTTPException(402, { cause: (e as Error).message });
  }
});

export default student;
