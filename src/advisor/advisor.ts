import { Hono } from "hono";
import { Binding } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Advisor, PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis/cloudflare";

const advisor = new Hono<{ Bindings: Binding }>();

advisor.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const result = await prisma.advisor.findMany();
  return c.json({ result });
});

//! FOR TESTING REDIS
advisor.get("/redis", async (c) => {
  const UPSTASH_REDIS_REST_TOKEN = c.env.UPSTASH_REDIS_REST_TOKEN;
  const UPSTASH_REDIS_REST_URL = c.env.UPSTASH_REDIS_REST_URL;
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_TOKEN: UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: UPSTASH_REDIS_REST_URL,
  });
  const data = await redis.get("advisor");
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

  const data = await c.req.json<Advisor>();
  await prisma.advisor.update({
    where: {
      advisor_id: data.advisor_id,
    },
    data: data,
  });
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
});

export default advisor;
