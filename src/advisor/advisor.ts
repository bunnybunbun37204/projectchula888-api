import { Hono } from "hono";
import { Binding, cacheUserData } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Advisor, PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { Redis } from "@upstash/redis/cloudflare";

const advisor = new Hono<{ Bindings: Binding }>();

advisor.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const result = await prisma.advisor.findMany();
  return c.json({ result });
});

advisor.get("/:id", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const id = c.req.param("id");

  const data = await prisma.advisor.findMany({
    where: {
      advisor_id: id,
    },
  });
  return c.json({ data });
});

advisor.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Advisor>();

  await prisma.advisor.create({
    data: {
      advisor_id: data.advisor_id,
      name: data.name,
      department: data.department,
      email: data.email,
    },
  });

  return c.json({ message: "Advisor create" });
});

advisor.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
  });

  const data = await c.req.json<Advisor>();

  await prisma.advisor.update({
    where: {
      advisor_id: data.advisor_id,
    },
    data: data,
  });

  const result: cacheUserData = {
    email: data.email,
    fname: data.name
      ? data.name.split(" ").length == 1
        ? data.name
        : data.name.split(" ")[0]
      : data.name,
    lname: data.name
      ? data.name.split(" ").length == 1
        ? " "
        : data.name.split(" ")[1]
      : " ",
    faculty: data.department,
    id: data.advisor_id,
    role: "advisor",
  };

  await redis.set(result.id, JSON.stringify(result));

  return c.json({ message: "update advisor success" });
});

advisor.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Advisor>();
  await prisma.advisor.delete({
    where: {
      advisor_id: data.advisor_id,
    },
  });

  return c.json({ message: "delete advisor success" });
});

advisor.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

export default advisor;
