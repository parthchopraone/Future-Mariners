import crypto from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
  const razorpayKeySecret = process.env.RAZORPAY_LIVE_KEY_SECRET ?? process.env.RAZORPAY_KEY_SECRET;
  if (!razorpayKeySecret) return NextResponse.json({ error: "Payment verification is unavailable." }, { status: 503 });

  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = await request.json();
    if (![orderId, paymentId, signature].every((value) => typeof value === "string" && value)) return NextResponse.json({ error: "Incomplete payment details." }, { status: 400 });
    const enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id, razorpayOrderId: orderId }, include: { course: true } });
    if (!enrollment) return NextResponse.json({ error: "Payment order was not found." }, { status: 404 });
    const expectedSignature = crypto.createHmac("sha256", razorpayKeySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    const razorpay = getRazorpay();
    const [order, payment] = await Promise.all([razorpay.orders.fetch(orderId), razorpay.payments.fetch(paymentId)]);
    const expectedAmount = enrollment.course.price * 100;
    if (order.id !== orderId || order.amount !== expectedAmount || order.currency !== "INR" || payment.order_id !== orderId || payment.amount !== expectedAmount || payment.currency !== "INR" || payment.status !== "captured") return NextResponse.json({ error: "Payment details could not be verified." }, { status: 400 });
    await prisma.enrollment.updateMany({ where: { id: enrollment.id, status: { not: "PAID" } }, data: { status: "PAID", razorpayPaymentId: paymentId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}