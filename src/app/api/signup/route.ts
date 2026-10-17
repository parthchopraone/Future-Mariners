import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidPhone, normalizePhone } from "@/lib/phone";

const courses = new Map([
  ["complete-imucet-preparation", { title: "Complete IMUCET + Sponsorship Preparation", price: 4999 }],
  ["imucet-interview-preparation", { title: "Complete Sponsorship Preparation", price: 2499 }],
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = normalizePhone(String(body.phone ?? "").trim());
    const password = String(body.password ?? "");
    const slug = String(body.courseSlug ?? "");
    const course = courses.get(slug);

    if (!name || !email || !isValidPhone(phone) || password.length < 8 || !course) {
      return NextResponse.json({ error: "Enter valid details and choose a course." }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await prisma.user.create({ data: { name, email, phone, passwordHash } });
    const storedCourse = await prisma.course.upsert({ where: { slug }, update: {}, create: { slug, title: course.title, price: course.price } });
    await prisma.enrollment.create({ data: { userId: user.id, courseId: storedCourse.id } });

    return NextResponse.json({ userId: user.id, next: `/checkout?course=${slug}` }, { status: 201 });
  } catch (error) {
    console.error("Signup failed:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
  }
}
