import path from "path";
import express from "express";
import { subscribeRouter } from "./routes/subscribe";
import { calendarRouter } from "./routes/calendar";
import { rulesRouter } from "./routes/rules";

const app = express();
const frontendPath = path.join(__dirname, "./ui");

app.use(express.json());
app.use("/subscribe", subscribeRouter);
app.use("/calendar", calendarRouter);
app.use("/rules", rulesRouter);

app.use(express.static(frontendPath));

app.get(/\*/, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(3000, () => {
  console.log("Calendar backend running on http://localhost:3000");
});
