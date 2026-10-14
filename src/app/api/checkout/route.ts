import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });

  try {
    const body = await request.json();
    const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
    if (!courseSlug) return NextResponse.json({ error: "Choose a course before checkout." }, { status: 400 });
    const enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id, course: { slug: courseSlug } }, include: { course: true, user: true } });
    if (!enrollment) return NextResponse.json({ error: "Course enrollment was not found." }, { status: 404 });
    if (enrollment.status === "PAID") return NextResponse.json({ url: "/dashboard" });
    const amount = enrollment.course.price * 100;
    if (amount < 100) return NextResponse.json({ error: "The payment amount must be at least ₹1." }, { status: 400 });
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) return NextResponse.json({ error: "Payment checkout is unavailable." }, { status: 503 });

    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: enrollment.id,
      notes: { enrollmentId: enrollment.id, userId: enrollment.userId, courseSlug },
    });
    await prisma.enrollment.update({ where: { id: enrollment.id }, data: { razorpayOrderId: order.id } });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, name: enrollment.course.title, email: enrollment.user.email });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}