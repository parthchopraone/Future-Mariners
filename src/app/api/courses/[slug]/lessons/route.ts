import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { slug } = await params;
  const enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id, status: "PAID", course: { slug } } });
  if (!enrollment) return NextResponse.json({ error: "A paid enrollment is required." }, { status: 403 });
  const lessons = await prisma.lesson.findMany({ where: { course: { slug } }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true, description: true, bunnyVideoId: true, bunnyLibraryId: true, duration: true, sortOrder: true } });
  return NextResponse.json({ lessons });
}