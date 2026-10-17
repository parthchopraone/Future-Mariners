import { NextResponse } from "next/server";
import recipients from "@/config/formRecipients.json";

type FormType = "contact" | "doubt";

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    if (type !== "contact" && type !== "doubt") return NextResponse.json({ error: "Form was not found." }, { status: 404 });
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = type === "contact" ? String(body.message ?? "").trim() : String(body.doubt ?? "").trim();
    const topic = type === "doubt" ? String(body.topic ?? "").trim() : "";
    const destination = recipients[type];
    if (!name || !email.includes("@") || !message || (type === "doubt" && !topic) || !destination.length || destination.some((address) => address.includes("replace-"))) return NextResponse.json({ error: "Form email settings are incomplete." }, { status: 500 });
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });

    const subject = type === "contact" ? `Contact request from ${name}` : `Student doubt: ${topic}`;
    const text = type === "contact" ? `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}` : `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nDoubt:\n${message}`;
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: destination, reply_to: email, subject, text }) });
    if (!response.ok) { console.error("Resend form email failed:", await response.text()); return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 }); }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Form submission failed:", error);
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}