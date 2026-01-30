export const schema = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  event_uid TEXT NOT NULL,
  kind TEXT NOT NULL,         -- DELETE_DATE (for now)
  date TEXT NOT NULL,         -- YYYYMMDD
  FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
);

CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  event_uid TEXT NOT NULL,
  kind TEXT NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
);
`;
