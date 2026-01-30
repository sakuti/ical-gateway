import { Router } from "express";
import { db } from "../db/db";
import { fetchIcs } from "../services/fetch-calendar";
import { transformCalendar } from "../services/transform-calendar";
import { emitIcs } from "../services/emit-calendar";
import { getCachedIcs } from "../services/request-cache";

export const calendarRouter = Router();

interface SubscriptionRow {
  id: string;
  source_url: string;
  created_at: string;
}

interface RuleRow {
  id: string;
  subscription_id: string;
  event_uid: string;
  kind: "DELETE_DATE";
  date: string;
}

calendarRouter.get("/:id.ics", async (req, res) => {
  const { id } = req.params;

  const cached = getCachedIcs(id);
  
  if (cached) {
    res.setHeader("Content-Type", "text/calendar");
    return res.send(cached);
  }

  const subscription = db
    .prepare("SELECT * FROM subscriptions WHERE id = ?")
    .get(id) as SubscriptionRow | undefined;

  if (!subscription) {
    return res.status(404).send("Not found");
  }

  const ruleRows = db
    .prepare("SELECT * FROM rules WHERE subscription_id = ?")
    .all(id) as RuleRow[];

  const rules = ruleRows.map((r) => ({
    kind: r.kind,
    event_uid: r.event_uid,
    date: r.date,
  }));

  const sourceIcs = await fetchIcs(subscription.source_url);
  const calendar = transformCalendar(sourceIcs, rules);
  const output = emitIcs(calendar);

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.send(output);
});
