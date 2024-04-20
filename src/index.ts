import { Hono } from "hono";
import student from "./student/student";
import project from "./project/project";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/student", student);
app.route("/project", project);

export default app;
