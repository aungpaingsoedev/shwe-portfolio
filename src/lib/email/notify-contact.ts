import { getSettings, getProfile } from "@/lib/data/content";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

async function getInboxEmail(): Promise<string> {
  const fromEnv = process.env.RESEND_TO_EMAIL?.trim();
  if (fromEnv) return fromEnv;

  const [settings, profile] = await Promise.all([getSettings(), getProfile()]);
  return (
    settings.contact_email?.trim() ||
    profile.email?.trim() ||
    "engr.shweyimonn@gmail.com"
  );
}

/** Send via Resend when RESEND_API_KEY is configured */
async function sendWithResend(
  to: string,
  payload: ContactPayload,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject: `[Portfolio] ${payload.subject}`,
      text: [
        `New message from ${payload.name} <${payload.email}>`,
        "",
        payload.message,
      ].join("\n"),
    });

    return !result.error;
  } catch {
    return false;
  }
}

/**
 * Forward to FormSubmit (no API key). First use may require
 * confirming the inbox address via their activation email.
 */
async function sendWithFormSubmit(
  to: string,
  payload: ContactPayload,
): Promise<boolean> {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _subject: `[Portfolio] ${payload.subject}`,
        message: payload.message,
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!response.ok) return false;
    const data = (await response.json().catch(() => null)) as {
      success?: string | boolean;
    } | null;
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

/**
 * Delivers the contact message to the site inbox.
 * Always best-effort — persistence in admin is the source of truth.
 */
export async function notifyContactInbox(
  payload: ContactPayload,
): Promise<{ emailed: boolean; method: "resend" | "formsubmit" | "none" }> {
  const to = await getInboxEmail();

  if (await sendWithResend(to, payload)) {
    return { emailed: true, method: "resend" };
  }

  if (await sendWithFormSubmit(to, payload)) {
    return { emailed: true, method: "formsubmit" };
  }

  return { emailed: false, method: "none" };
}
