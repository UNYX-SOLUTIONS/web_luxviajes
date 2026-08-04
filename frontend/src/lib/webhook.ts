const WEBHOOK_URL =
  process.env.WEBHOOK_URL ||
  "https://flow.agencialuxviajes.com/webhook-test/0db7e68e-c8f9-401d-8768-a0ecc41da336";
const WEBHOOK_TIMEOUT = parseInt(process.env.WEBHOOK_TIMEOUT || "10000", 10);

interface WebhookPayload {
  email: string;
  name: string;
  last_name: string;
  code: string;
}

export async function sendVerificationWebhook(
  email: string,
  primerNombre: string,
  apellido: string,
  code: string
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);

    const payload: WebhookPayload = {
      email,
      name: primerNombre,
      last_name: apellido,
      code,
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[Webhook] n8n responded with ${response.status}: ${response.statusText}`);
      return false;
    }

    console.log(`[Webhook] Verification email sent for ${email}`);
    return true;
  } catch (error) {
    console.error("[Webhook] Failed to send:", error);
    return false;
  }
}
