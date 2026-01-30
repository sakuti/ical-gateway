export interface DeleteDateRule {
  kind: "DELETE_DATE";
  event_uid: string;
  date: string; // YYYYMMDD
}
