import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { Binding, UserData } from "../../type";
import { Redis } from "@upstash/redis/cloudflare";

const auth = new Hono<{ Bindings: Binding }>();

const serviceValidation = async (
  ticket: string,
  DeeAppId: string,
  DeeAppSecret: string
) => {
  try {
    const url = "https://account.it.chula.ac.th/serviceValidation";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        DeeAppId: DeeAppId,
        DeeAppSecret: DeeAppSecret,
        DeeTicket: ticket,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const jsonResponse: UserData = await response.json();
      return {
        status: 200,
        message: jsonResponse,
      };
    } else {
      const jsonResponse = await response.json();
      return {
        status: response.status,
        message: jsonResponse,
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

auth.get("/callback/:ticket", async (c) => {
  const DeeAppId = c.env.DeeAppId;
  const DeeAppSecret = c.env.DeeAppSecret;
  const ticket = c.req.param("ticket");
  if (!ticket || !DeeAppId || !DeeAppSecret) {
    return c.json({
      message: "Ticket or app id or app secret is missing",
      status: 400,
    });
  }

  const { status, message } = await serviceValidation(
    ticket,
    DeeAppId,
    DeeAppSecret
  );
  if (status === 200 && message != null) {
    const datas: UserData = message as UserData;
    const student_id = datas.username;

    const redis = Redis.fromEnv({
      UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
      UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
    });

    await redis.set(student_id, 'logined');

    return c.json({ message: datas });
  }

  return c.json({ message: message });
});

auth.get("/signout", (c) => {
  deleteCookie(c, "first_name");
  deleteCookie(c, "last_name");
  deleteCookie(c, "student_id");
  return c.redirect(
    "https://account.it.chula.ac.th/logout?service=https://projectchula888.pages.dev/"
  );
});

auth.get("/t", (c) => {
  return c.text("Hello");
});

export default auth;
