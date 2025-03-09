import {Context, Hono, Next} from "hono";
import {serve} from "@hono/node-server";

import {RiskEngine} from "./services/risk-engine";
import {PhoneNumberRisk} from "./services/phone-number-risk";
import {APPLICATION} from "./consts";
import {Application} from "./types";

const getApplication = async () => {
  return APPLICATION;
};

interface HonoContext extends Context {
  application?: Application;
}

const app = new Hono();

const middleWare = async (context: HonoContext, next: Next) => {
  const application = await getApplication();
  if (!application) {
    return context.json({error: "Unauthorized"}, 401);
  }

  context.set("application", application);

  await next();
};

app.get("/risk-engine", middleWare, async (context) => {
  const application = context.get("application");

  const riskEngine = new RiskEngine([new PhoneNumberRisk(application)]);

  const risk = await riskEngine.calculateUserRisk();
  console.table(risk.results);
  return context.json(risk.score);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  ({port}) => {
    console.log(`Server is running on http://localhost:${port}`);
  }
);
