import { Hono } from "hono";
import { logger } from "hono/logger";
import student from "./student/student";
import project from "./project/project";
import advisor from "./advisor/advisor";
import project_advisor from "./project_advisor/project_advisor";
import project_student from "./project_student/project_student";
import auth from "./auth/auth";
import { Redis } from "@upstash/redis/cloudflare";
import { env } from "hono/adapter";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

//! FOR TESTING REDIS
app.get("/redis", async (c) => {
  const { UPSTASH_REDIS_REST_TOKEN } = env<{
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(c);
  const { UPSTASH_REDIS_REST_URL } = env<{ UPSTASH_REDIS_REST_URL: string }>(c);
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_TOKEN: UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: UPSTASH_REDIS_REST_URL,
  });
  const data = await redis.get("advisor");
  return c.json({ data });
});

app.notFound((c) => {
  return c.text("Page not found please check API docs in github kub pom", 404);
});

app.route("/auth", auth);
app.route("/student", student);
app.route("/project", project);
app.route("/advisor", advisor);
app.route("/project_advisor", project_advisor);
app.route("/project_student", project_student);

export default app;
