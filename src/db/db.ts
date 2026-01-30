import Database from "better-sqlite3";
import { schema } from "./schema";

export const db = new Database("calendar.db");
db.exec(schema);
