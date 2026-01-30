import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "../db/db";
import { DeleteDateRule } from "../models/rules";

export const rulesRouter = Router();

/**
 * POST /rules
 * Body: { subscriptionId, eventUid, date }
 */
rulesRouter.post("/", (req, res) => {
  const { subscriptionId, eventUid, date } = req.body;

  // Basic validation
  if (!subscriptionId || !eventUid || !date) {
    return res.status(400).json({ error: "subscriptionId, eventUid and date are required" });
  }

  const id = randomUUID();

  try {
    db.prepare(`
      INSERT INTO rules (id, subscription_id, event_uid, kind, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, subscriptionId, eventUid, "DELETE_DATE", date);

    const rule: DeleteDateRule = {
      kind: "DELETE_DATE",
      event_uid: eventUid,
      date
    };

    res.status(201).json({ id, rule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save rule" });
  }
});


rulesRouter.get("/", (req, res) => {
  const subscriptionId = req.query.subscriptionId as string;

  if (!subscriptionId) {
    return res.status(400).json({ error: "subscriptionId query parameter is required" });
  }

  try {
    const rows: {
      id: string;
      kind: string;
      event_uid: string;
      date: string;
    }[] = db
      .prepare("SELECT id, kind, event_uid, date FROM rules WHERE subscription_id = ?")
      .all(subscriptionId) as {
      id: string;
      kind: string;
      event_uid: string;
      date: string;
    }[];

    const rulesWithDescriptions = rows.map((r) => {
      let description = "";

      switch (r.kind) {
        case "DELETE_DATE":
          description = `Poista tapahtuma, jonka UID on '${r.event_uid}' jos se tapahtuu ${formatDate(r.date)}`;
          break;
        default:
          description = `${r.kind} tyyppinen sääntö, joka vaikuttaa tapahtumaan '${r.event_uid}'. Ei tarkempaa kuvausta.`;
      }

      return { ...r, description };
    });

    res.json(rulesWithDescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rules" });
  }
});

rulesRouter.delete("/", (req, res) => {
  const { subscriptionId, ruleId } = req.body as { subscriptionId: string; ruleId: string };

  if (!subscriptionId || !ruleId) {
    return res.status(400).json({ error: "subscriptionId and ruleId are required" });
  }

  try {
    // Check if the rule exists for this subscription
    const rule = db
      .prepare("SELECT id FROM rules WHERE id = ? AND subscription_id = ?")
      .get(ruleId, subscriptionId) as {
        id: string
      };

    if (!rule) {
      return res.status(404).json({ error: "Rule not found for this subscription" });
    }

    // Delete the rule
    db.prepare("DELETE FROM rules WHERE id = ?").run(ruleId);

    res.json({ success: true, message: `Rule ${ruleId} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete rule" });
  }
});

function formatDate(value: string): string {
  // Match either YYYYMMDD or YYYYMMDDTHHMMSS
  const dateTimeMatch = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?$/);

  if (!dateTimeMatch) return value; // fallback

  const [, yearStr, monthStr, dayStr, hourStr, minStr, secStr] = dateTimeMatch;

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const hour = hourStr ? parseInt(hourStr, 10) : 0;
  const min = minStr ? parseInt(minStr, 10) : 0;
  const sec = secStr ? parseInt(secStr, 10) : 0;

  const date = new Date(year, month, day, hour, min, sec);

  return date.toLocaleString("fi-FI"); 
}
