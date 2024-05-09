import { Hono } from "hono";
import { logger } from "hono/logger";
import student from "./student/student";
import project from "./project/project";
import advisor from "./advisor/advisor";
import auth from "./auth/auth";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Honooo!");
});

app.notFound((c) => {
  return c.text("Page not found please check API docs in github kub pom", 404);
});

app.route("/auth", auth);
app.route("/student", student);
app.route("/project", project);
app.route("/advisor", advisor);

export default app;
