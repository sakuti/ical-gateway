import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "../db/db";

export const subscribeRouter = Router();

subscribeRouter.post("/", (req, res) => {
  const { sourceUrl } = req.body;
  if (!sourceUrl) {
    return res.status(400).json({ error: "sourceUrl required" });
  }

  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO subscriptions (id, source_url, created_at)
    VALUES (?, ?, ?)
  `,
  ).run(id, sourceUrl, new Date().toISOString());

  res.json({
    subscriptionId: id,
    subscriptionUrl: `/calendar/${id}.ics`,
  });
});
