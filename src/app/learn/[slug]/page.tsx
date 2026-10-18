import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBunnyEmbedUrl } from "@/lib/bunny";
import { getCourseProgress } from "@/lib/courseProgress";
import MarkComplete from "../markComplete";

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const LearnPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const { v } = await searchParams;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, status: "PAID", course: { slug } },
    include: { course: true },
  });
  if (!enrollment) redirect(`/checkout?course=${slug}`);
  if (!enrollment.course) notFound();

  const progress = await getCourseProgress(session.user.id, enrollment.courseId, slug);
  const { modules, completedIds, loadError } = progress;

  // Flat list in module order. The requested video must be one of these.
  const flat = modules.flatMap((m) => m.videos.map((video) => ({ ...video, moduleTitle: m.title })));
  const requested = flat.findIndex((x) => x.id === v);
  const nextIndex = progress.nextVideo ? flat.findIndex((x) => x.id === progress.nextVideo!.id) : 0;
  const index = requested >= 0 ? requested : Math.max(nextIndex, 0); // no ?v= → resume where they left off
  const current = flat[index];
  const prev = flat[index - 1];
  const next = flat[index + 1];
  const embedUrl = current ? getBunnyEmbedUrl(current.id) : null;
  const href = (id: string) => `/learn/${slug}?v=${id}`;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#0b1427] py-10 text-white sm:py-16">
      <div className="container">
        <Link href="/dashboard" className="text-sm font-bold text-[#e4aa3b]">← Back to dashboard</Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section>
            <p className="text-sm font-bold tracking-[0.18em] text-[#e4aa3b] uppercase">Now learning</p>
            <h1 className="mt-3 font-mulish text-3xl font-bold sm:text-4xl">{enrollment.course.title}</h1>

            <div className="mt-8 aspect-video overflow-hidden bg-[#16243d]">
              {embedUrl ? (
                <iframe
                  key={current.id}
                  src={embedUrl}
                  title={current.title}
                  className="h-full w-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-[#b8c7dc]">
                  {loadError
                    ? "We could not load your lessons right now. Please refresh in a minute."
                    : "Lessons for this course will appear here soon."}
                </div>
              )}
            </div>

            {current && (
              <>
                <p className="mt-8 text-sm text-[#8fa3bf]">{current.moduleTitle}</p>
                <h2 className="mt-1 font-mulish text-2xl font-bold">{current.title}</h2>
                <div className="mt-6 flex flex-wrap items-start gap-3">
                  <MarkComplete slug={slug} videoId={current.id} completed={completedIds.has(current.id)} />
                  {prev && <Link href={href(prev.id)} className="border border-white/20 px-5 py-2.5 text-sm font-bold">← Previous</Link>}
                  {next && <Link href={href(next.id)} className="bg-[#7D52F4] px-5 py-2.5 text-sm font-bold">Next lesson →</Link>}
                </div>
              </>
            )}
          </section>

          <aside className="h-fit bg-[#14233c] p-6">
            <p className="text-sm font-bold tracking-[0.16em] text-[#e4aa3b] uppercase">Course content</p>
            {progress.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold text-[#d9e0eb]">
                  <span>{progress.done} of {progress.total} lessons complete</span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-[#e4aa3b]" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {modules.length ? (
                modules.map((m) => (
                  <details key={m.collectionId} open={m.videos.some((x) => x.id === current?.id)} className="border border-white/10">
                    <summary className="cursor-pointer p-4 font-bold">
                      {m.title} <span className="font-normal text-[#8fa3bf]">({m.done}/{m.videos.length})</span>
                    </summary>
                    <div className="space-y-1 px-2 pb-2">
                      {m.videos.map((video) => {
                        const isDone = completedIds.has(video.id);
                        return (
                          <Link
                            key={video.id}
                            href={href(video.id)}
                            className={`flex items-center gap-3 p-3 text-sm ${video.id === current?.id ? "bg-[#1d2c49] text-white ring-1 ring-[#7D52F4]" : "text-[#b8c7dc] hover:bg-white/5"}`}
                          >
                            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${isDone ? "bg-[#e4aa3b] text-[#0b1427]" : "border border-white/30"}`}>
                              {isDone ? "✓" : ""}
                            </span>
                            <span className="min-w-0 flex-1">{video.title}</span>
                            <span className="shrink-0 text-xs text-[#8fa3bf]">{formatTime(video.seconds)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#b8c7dc]">Modules will be added to your course soon.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default LearnPage;