import { Hono } from "hono";
import { Binding, cacheUserData, UserData } from "../../type";
import { Redis } from "@upstash/redis/cloudflare";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { serviceValidation } from "../../utils";
import { HTTPException } from "hono/http-exception";

const auth = new Hono<{ Bindings: Binding }>();

auth.get("/register/:ticket", async (c) => {
  const DeeAppId = c.env.DeeAppId;
  const DeeAppSecret = c.env.DeeAppSecret;
  const ticket = c.req.param("ticket");

  // if ticket and token is missing return 400;
  if (!ticket || !DeeAppId || !DeeAppSecret) {
    return c.json({
      message: "Ticket or app id or app secret is missing",
      status: 400,
    });
  }

  // fetch user data from chula api
  const { status, message } = await serviceValidation(
    ticket,
    DeeAppId,
    DeeAppSecret
  );

  // if fetching success
  if (status === 200 && message != null) {
    const datas: UserData = message as UserData;
    const redis = Redis.fromEnv({
      UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
      UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
    });

    // find cache data on Redis by id
    const cacheData: cacheUserData = (await redis.get(
      datas.username
    )) as cacheUserData;

    // if student id is in cache return;
    if (cacheData) {
      return c.json({ result: cacheData });
    }

    // else register student, advisor and save cache then return;
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });

    const result: cacheUserData = {
      id: datas.username,
      email: datas.email,
      fname: datas.firstnameth,
      lname: datas.lastnameth,
      role: datas.roles[0],
      faculty: datas.gecos.split(", ")[1].trim(),
    };

    // save users to register;
    if (result.role === "student") {
      await prisma.student.create({
        data: {
          student_id: result.id,
          email: result.email,
          major: result.role,
          name: result.fname + " " + result.lname,
        },
      });
    } else {
      await prisma.advisor.create({
        data: {
          advisor_id: result.id,
          department: result.faculty,
          email: result.email,
          name: result.fname + " " + result.lname,
        },
      });
    }

    // add cache
    await redis.set(result.id, JSON.stringify(result));

    return c.json({ result });
  }

  return c.json({ message: message });
});

auth.get("/signout", (c) => {
  return c.redirect(
    "https://account.it.chula.ac.th/logout?service=https://projectchula888.pages.dev/"
  );
});

auth.get("/t", (c) => {
  return c.text("Hello");
});

auth.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});

export default auth;
