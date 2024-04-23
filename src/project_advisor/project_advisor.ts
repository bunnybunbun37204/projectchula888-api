import { Hono } from "hono";
import { Binding } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project_advisor } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const project_advisor = new Hono<{ Bindings: Binding }>();

project_advisor.get("/count", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    const count = await prisma.project_advisor.count();
    return c.json({ count });
});

project_advisor.get("/:advId", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    const advisor_id = Number.parseInt(c.req.param("advId"));
  
    const data = await prisma.project_advisor.findMany({
      where: {
        advisorId: advisor_id,
      },
    });
    return c.json({ data });
}); 
  
project_advisor.get("/", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
  
    const data = await prisma.project_advisor.findMany();
    return c.json({ data });
});

project_advisor.post("/", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
  
    const data = await c.req.json<Project_advisor>();
    await prisma.project_advisor.create({
        data: {
            id: data.id,
            advisorId: data.advisorId,
            projectId: data.projectId
      },
    });
    return c.json({ message: "Create success" }, 200);
}); 

project_advisor.patch("/", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
  
    const data = await c.req.json<Project_advisor>();
  
    await prisma.project_advisor.update({
      where: {
        id: data.id,
      },
      data: {
        advisorId: data.advisorId,
        projectId: data.projectId
      },
    });
    return c.json({ message: "Update success" });
});

project_advisor.delete("/", async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
  
    const data = await c.req.json<Project_advisor>();
  
    await prisma.project_advisor.delete({
      where: {
        id: data.id,
      },
    });
  
    return c.json({ message: "Delete success" });
  }); 

  project_advisor.onError((err) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    throw new HTTPException(400, {
      message: (err as Error).message,
      cause: (err as Error).cause,
    });
  });

//Never Test  
export default project_advisor;