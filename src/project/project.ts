import { Hono } from "hono";
import { Binding } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project = new Hono<{ Bindings: Binding }>();

project.get("/count",async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.project.count();
  return c.json({ count});
})  //Done

project.get("/:id", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const id = Number.parseInt(c.req.param("id"));

  const data = await prisma.project.findMany({
    where: {
      Project_id: id
    }
  });
  return c.json({ data });
}); //Done

project.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const result = await prisma.project.findMany();
  return c.json({ result });
}); //Done

project.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status
    },
  });
  return c.json({ message: "Create Project success" });
}); //Done

project.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

project.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();

  await prisma.project.update({
    where: {
      Project_id: data.Project_id,
    },
    data: {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status
    },
  });
  return c.json({ message: "Update success" });
}); //Done

project.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();

  await prisma.project.delete({
    where: {
      Project_id: data.Project_id,
    },
  });

  return c.json({ message: "Delete success" });
}); //Done

export default project;
