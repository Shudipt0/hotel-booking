import express from "express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const router = express.Router();

// RAW body ONLY for webhooks
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

export default router;