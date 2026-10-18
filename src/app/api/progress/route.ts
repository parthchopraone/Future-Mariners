import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loadCourseModules } from "@/lib/courseProgress";

// Marks one lesson (Bunny video) complete or incomplete for the signed-in student.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const videoId = body?.videoId;
  const completed = body?.completed;
  if (typeof slug !== "string" || typeof videoId !== "string" || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Only paid students can record progress.
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, status: "PAID", course: { slug } },
    select: { id: true, courseId: true },
  });
  if (!enrollment) return NextResponse.json({ error: "Not enrolled." }, { status: 403 });

  // The video must really belong to this course.
  const { modules } = await loadCourseModules(slug);
  const courseVideoIds = Array.from(new Set(modules.flatMap((m) => m.videos.map((v) => v.id))));
  if (!courseVideoIds.includes(videoId)) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const { courseId } = enrollment;
  if (completed) {
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_videoId: { userId, courseId, videoId } },
      update: {},
      create: { userId, courseId, videoId },
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId, courseId, videoId } });
  }

  // Keep Enrollment.progress in sync with the real numbers.
  const done = await prisma.lessonProgress.count({ where: { userId, courseId, videoId: { in: courseVideoIds } } });
  const percent = courseVideoIds.length ? Math.round((done / courseVideoIds.length) * 100) : 0;
  await prisma.enrollment.update({ where: { id: enrollment.id }, data: { progress: percent } });

  return NextResponse.json({ ok: true, percent });
}