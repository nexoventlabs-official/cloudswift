import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO = process.env.CONTACT_EMAIL ?? "hello.in@oncloudswift.com";
const FROM = process.env.CONTACT_FROM ?? "CloudSwift Contact <noreply@oncloudswift.com>";
const BACKEND = (process.env.BACKEND_API_BASE ?? "https://cloudswift.onrender.com/api").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, company, interest, message, source } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 422 });
  }

  let leadOk = false;
  let emailOk = false;

  // 1. Create a lead in the CRM backend so the enquiry shows up in the admin panel.
  try {
    const r = await fetch(`${BACKEND}/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, interest, message, source: source ?? "website" }),
    });
    leadOk = r.ok;
    if (!r.ok) console.error("[contact] backend lead failed:", r.status);
  } catch (err) {
    console.error("[contact] backend lead error:", err);
  }

  // 2. Optionally email the enquiry via Resend (only if configured).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `[CloudSwift Enquiry] ${interest ?? "General"} — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company ?? "—"}`,
          `Service: ${interest ?? "—"}`,
          `Source: ${source ?? "website"}`,
          "",
          message,
        ].join("\n"),
      });
      emailOk = !error;
      if (error) console.error("[contact] Resend error:", error);
    } catch (err) {
      console.error("[contact] Resend threw:", err);
    }
  }

  if (leadOk || emailOk) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 502 });
}
