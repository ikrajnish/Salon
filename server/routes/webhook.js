// routes/webhook.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  // verification from Meta
  const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

router.post("/", async (req, res) => {
  // handle messages, store user phone, etc.
  const body = req.body;
  // Respond 200 early
  res.sendStatus(200);
  // process body asynchronously (store opt-in, log message)
});

export default router;
