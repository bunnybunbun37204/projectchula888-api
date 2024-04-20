import { Hono } from "hono";
import { Binding } from "../../type";

const project = new Hono<{Bindings : Binding}>();

export default project;