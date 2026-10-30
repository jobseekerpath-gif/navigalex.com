// MSME screening routes are implemented in this module.
import type { Express } from 'express';
export function registerMsmeRoutes(_app: Express) {
  // Routes will be registered after the server's JSON parser, except the raw-body webhook.
}
export function registerCashfreeWebhook(_app: Express) {
  // Webhook route must be mounted before express.json() so signature verification uses raw bytes.
}
