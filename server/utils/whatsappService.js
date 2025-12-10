// utils/whatsappService.js
// Sends text and template messages via WhatsApp Cloud API
import fetch from "node-fetch";

const API_VERSION = process.env.WA_API_VERSION || "v17.0";
const PHONE_ID = process.env.WA_PHONE_ID;
const TOKEN = process.env.WA_ACCESS_TOKEN;
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`;

if (!PHONE_ID || !TOKEN) {
  console.warn("⚠️ WhatsApp Cloud API not configured. Set WA_PHONE_ID and WA_ACCESS_TOKEN in env.");
}

async function sendRequest(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error("WhatsApp API error");
    err.status = res.status;
    err.details = json;
    throw err;
  }
  return json;
}

/**
 * Send plain text message (useful only when user recently messaged you or for testing).
 * toPhoneNumber must be E.164 (e.g., "9198xxxxxxx")
 */
export const sendText = async (toPhoneNumber, text) => {
  const payload = {
    messaging_product: "whatsapp",
    to: toPhoneNumber,
    type: "text",
    text: { body: text },
  };
  return sendRequest(payload);
};

/**
 * Send approved template message.
 * templateName: the template slug as created in Meta Business Manager
 * components: array of components (body params etc.)
 * Example components:
 * [
 *  { type: "body", parameters: [{ type: "text", text: "123456" }] }
 * ]
 */
export const sendTemplate = async (toPhoneNumber, templateName, language = "en_US", components = []) => {
  const payload = {
    messaging_product: "whatsapp",
    to: toPhoneNumber,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components,
    },
  };
  return sendRequest(payload);
};

/**
 * Send media message (image/document) by URL
 * type: "image" | "document" | "video"
 * mediaUrl: public accessible url
 */
export const sendMediaUrl = async (toPhoneNumber, type, mediaUrl, caption) => {
  const payload = {
    messaging_product: "whatsapp",
    to: toPhoneNumber,
    type,
    [type]: { link: mediaUrl, caption },
  };
  return sendRequest(payload);
};
