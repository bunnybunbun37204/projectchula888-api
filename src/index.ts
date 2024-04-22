import { Hono } from "hono";
import { logger } from 'hono/logger'
import student from "./student/student";
import project from "./project/project";
import project_student from "./project_student/project_student";
import project_advisor from "./project_advisor/project_advisor";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.notFound((c) => {
  return c.text("Page not found please check API docs in github kub pom", 404);
});

app.route("/student", student);
app.route("/project", project);
app.route("/project_student",project_student);
app.route("/project_advisor", project_advisor)

export default app;
