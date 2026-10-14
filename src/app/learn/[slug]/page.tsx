import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBunnyEmbedUrl } from "@/lib/bunny";

const LearnPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const { slug } = await params;
  const enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id, status: "PAID", course: { slug } }, include: { course: { include: { lessons: { orderBy: { sortOrder: "asc" } } } } } });
  if (!enrollment) redirect(`/checkout?course=${slug}`);
  if (!enrollment.course) notFound();
  const firstLesson = enrollment.course.lessons[0];

  return <main className="min-h-[calc(100vh-80px)] bg-[#0b1427] py-10 text-white sm:py-16"><div className="container"><Link href="/dashboard" className="text-sm font-bold text-[#e4aa3b]">← Back to dashboard</Link><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]"><section><p className="text-sm font-bold tracking-[0.18em] text-[#e4aa3b] uppercase">Now learning</p><h1 className="mt-3 font-mulish text-3xl font-bold sm:text-4xl">{enrollment.course.title}</h1><div className="mt-8 aspect-video overflow-hidden bg-[#16243d]">{firstLesson && getBunnyEmbedUrl(firstLesson.bunnyVideoId, firstLesson.bunnyLibraryId ?? undefined) ? <iframe src={getBunnyEmbedUrl(firstLesson.bunnyVideoId, firstLesson.bunnyLibraryId ?? undefined) ?? undefined} title={firstLesson.title} className="h-full w-full" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <div className="flex h-full items-center justify-center p-8 text-center text-[#b8c7dc]">Your Bunny Stream lesson player will appear here after the video ID is configured.</div>}</div><h2 className="mt-8 font-mulish text-2xl font-bold">{firstLesson?.title ?? "Course lessons"}</h2><p className="mt-3 leading-7 text-[#b8c7dc]">{firstLesson?.description ?? "Your recorded lessons and study material will appear here."}</p></section><aside className="bg-[#14233c] p-6"><p className="text-sm font-bold tracking-[0.16em] text-[#e4aa3b] uppercase">Course lessons</p><div className="mt-5 space-y-2">{enrollment.course.lessons.length ? enrollment.course.lessons.map((lesson, index) => <div key={lesson.id} className={`border p-4 ${index === 0 ? "border-[#7D52F4] bg-[#1d2c49]" : "border-white/10"}`}><p className="text-xs text-[#8fa3bf]">Lesson {index + 1}</p><p className="mt-1 font-medium">{lesson.title}</p></div>) : <p className="text-sm leading-6 text-[#b8c7dc]">Lessons will be added to your course soon.</p>}</div></aside></div></div></main>;
};

export default LearnPage;