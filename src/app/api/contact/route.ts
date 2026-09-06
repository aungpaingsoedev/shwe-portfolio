import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/data/content";
import { notifyContactInbox } from "@/lib/email/notify-contact";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    website?: string; // honeypot
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot — bots fill this; humans don't see it
  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json(
      { error: "One or more fields are too long." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const saved = await createContactMessage({ name, email, subject, message });

  const delivery = await notifyContactInbox({
    name,
    email,
    subject,
    message,
  });

  return NextResponse.json({
    ok: true,
    id: saved.id,
    emailed: delivery.emailed,
  });
}
