import { Hono } from "hono";
import { Binding } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project = new Hono<{ Bindings: Binding }>();

project.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.project.findMany();
    return c.json({ result });
  } catch (e) {
    throw new HTTPException(400, {
      message: (e as Error).message,
      cause: (e as Error).cause,
    });
  }
});

project.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({message: "error"});
});

export default project;
