import { Hono } from "hono";
import student from "./student";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/student", student);

export default app;
