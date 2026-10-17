import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const identifierFor = (email: string) => `password-reset:${email}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const identifier = identifierFor(email);
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    await prisma.verificationToken.create({ data: { identifier, token: crypto.createHash("sha256").update(token).digest("hex"), expires: new Date(Date.now() + 60 * 60 * 1000) } });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? new URL(request.url).origin}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [email], subject: "Reset your Future Mariners password", text: `Reset your password using this link. It expires in one hour:\n\n${resetUrl}` }) });
      if (!response.ok) throw new Error("Password reset email failed.");
    }

    return NextResponse.json({ ok: true, ...(process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY ? { resetUrl } : {}) });
  } catch (error) {
    console.error("Password reset request failed:", error);
    return NextResponse.json({ error: "Unable to start password reset." }, { status: 500 });
  }
}