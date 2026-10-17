import crypto from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const signature = (await headers()).get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!signature || !secret) return new NextResponse("Missing webhook signature.", { status: 400 });
  const payload = await request.text();
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return new NextResponse("Invalid webhook signature.", { status: 400 });
  const event = JSON.parse(payload) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string; amount?: number; currency?: string; status?: string } } } };
  const payment = event.payload?.payment?.entity;
  if (event.event === "payment.captured" && payment?.order_id && payment.id && payment.status === "captured") {
    const enrollment = await prisma.enrollment.findFirst({ where: { razorpayOrderId: payment.order_id }, include: { course: true } });
    const expectedAmount = enrollment ? (enrollment.paymentAmount ?? enrollment.course.price) * 100 : 0;
    if (enrollment && payment.amount === expectedAmount && payment.currency === "INR") {
      await prisma.enrollment.updateMany({ where: { id: enrollment.id, status: { not: "PAID" } }, data: { status: "PAID", razorpayPaymentId: payment.id } });
    }
  }
  return NextResponse.json({ received: true });
}