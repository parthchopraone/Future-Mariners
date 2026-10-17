import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { coursesData } from "@/components/courses/courseData";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });

  try {
    const body = await request.json();
    const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
    const isUpgrade = body.upgrade === true && courseSlug === "complete-imucet-preparation";
    if (!courseSlug) return NextResponse.json({ error: "Choose a course before checkout." }, { status: 400 });
    const catalogCourse = coursesData.find((course) => course.slug.current === courseSlug);
    if (!catalogCourse) return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    if (isUpgrade) {
      const sponsorship = await prisma.enrollment.findFirst({ where: { userId: session.user.id, status: "PAID", course: { slug: "imucet-interview-preparation" } } });
      if (!sponsorship) return NextResponse.json({ error: "This upgrade is available after sponsorship enrolment." }, { status: 403 });
    }
    const paymentAmount = isUpgrade ? 2600 : catalogCourse.price;
    const course = await prisma.course.upsert({ where: { slug: courseSlug }, update: { title: catalogCourse.title, price: catalogCourse.price }, create: { slug: courseSlug, title: catalogCourse.title, price: catalogCourse.price } });
    const enrollment = await prisma.enrollment.upsert({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } }, update: { paymentAmount }, create: { userId: session.user.id, courseId: course.id, paymentAmount }, include: { course: true, user: true } });
    if (enrollment.status === "PAID") return NextResponse.json({ url: "/dashboard" });
    const amount = (enrollment.paymentAmount ?? enrollment.course.price) * 100;
    if (amount < 100) return NextResponse.json({ error: "The payment amount must be at least ₹1." }, { status: 400 });
    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!process.env.RAZORPAY_LIVE_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET || !publicKeyId) return NextResponse.json({ error: "Payment checkout is unavailable." }, { status: 503 });

    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: enrollment.id,
      notes: { enrollmentId: enrollment.id, userId: enrollment.userId, courseSlug },
    });
    await prisma.enrollment.update({ where: { id: enrollment.id }, data: { razorpayOrderId: order.id } });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: publicKeyId, name: enrollment.course.title, email: enrollment.user.email });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}