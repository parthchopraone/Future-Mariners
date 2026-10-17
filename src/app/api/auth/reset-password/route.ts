import crypto from "node:crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const token = String(body.token ?? "");
    const password = String(body.password ?? "");
    if (!email || !token || password.length < 8) return NextResponse.json({ error: "Enter a valid reset link and a password of at least 8 characters." }, { status: 400 });

    const storedToken = await prisma.verificationToken.findUnique({ where: { identifier_token: { identifier: `password-reset:${email}`, token: crypto.createHash("sha256").update(token).digest("hex") } } });
    if (!storedToken || storedToken.expires < new Date()) return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });

    const passwordHash = await hash(password, 12);
    await prisma.$transaction([prisma.user.update({ where: { email }, data: { passwordHash } }), prisma.verificationToken.delete({ where: { identifier_token: { identifier: storedToken.identifier, token: storedToken.token } } })]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json({ error: "Unable to reset your password." }, { status: 500 });
  }
}