import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

dotenv.config({ path: ".env.local" });
const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  throw new Error("The demo seed is disabled in production.");
}

async function main() {
  const passwordHash = await hash("DemoPass123!", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@skillsaint.local" },
    update: { name: "Demo Student", phone: "+919999999999", passwordHash },
    create: { name: "Demo Student", email: "demo@skillsaint.local", phone: "+919999999999", passwordHash },
  });
  const course = await prisma.course.upsert({
    where: { slug: "complete-imucet-preparation" },
    update: { title: "Complete IMUCET + Sponsorship Preparation", price: 4999 },
    create: { slug: "complete-imucet-preparation", title: "Complete IMUCET + Sponsorship Preparation", price: 4999 },
  });
  const lessons = ["IMUCET strategy and study plan", "Mathematics foundations", "Physics fundamentals", "English and communication", "General knowledge for maritime aspirants", "Mock test and interview preparation"];
  for (const [index, title] of lessons.entries()) {
    await prisma.lesson.upsert({
      where: { id: `${course.id}-demo-${index + 1}` },
      update: { title, sortOrder: index + 1, description: "Demo lesson content for the local dashboard.", bunnyVideoId: "", duration: 45 },
      create: { id: `${course.id}-demo-${index + 1}`, courseId: course.id, title, sortOrder: index + 1, description: "Demo lesson content for the local dashboard.", bunnyVideoId: "", duration: 45 },
    });
  }
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: { status: "PAID", progress: 42 },
    create: { userId: user.id, courseId: course.id, status: "PAID", progress: 42 },
  });
  console.log("Demo account ready: demo@skillsaint.local / DemoPass123!");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());