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
  const count = prisma.student.count();
  return c.json({ count });
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
    throw new HTTPException(401, { cause: e });
  }
});

export default student;
