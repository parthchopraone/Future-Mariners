import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBunnyEmbedUrl } from "@/lib/bunny";
import { getCourseProgress } from "@/lib/courseProgress";
import MarkComplete from "../markComplete";
import BackLink from "@/components/ui/backLink";
import { ArrowLeft, ArrowRight } from "@/lib/icons";

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
  const moduleSections = Object.entries(
    modules.reduce<Record<string, typeof modules>>((sections, module) => {
      const section = module.section ?? "Course content";
      (sections[section] ??= []).push(module);
      return sections;
    }, {}),
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#0b1427] py-10 text-white sm:py-16">
      <div className="container">
        <BackLink href="/dashboard" className="border-white/20 bg-white/5 text-[#d9e1ec] hover:border-[#e4aa3b] hover:text-white">Back to dashboard</BackLink>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section>
            <p className="text-sm font-bold tracking-[0.18em] text-[#e4aa3b] uppercase">Now learning</p>
            <h1 className="mt-3 font-mulish text-3xl font-bold sm:text-4xl">{enrollment.course.title}</h1>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black p-1 shadow-2xl shadow-black/20">
              <div className="aspect-video overflow-hidden rounded-2xl bg-[#16243d]">
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
            </div>

            {current && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-[#14233c] p-5 sm:mt-6 sm:p-6">
                <p className="text-xs font-bold tracking-[0.16em] text-[#e4aa3b] uppercase">{current.moduleTitle}</p>
                <h2 className="mt-2 font-mulish text-2xl font-bold">{current.title}</h2>
                <div className="mt-5 flex flex-wrap items-start gap-3">
                  <MarkComplete slug={slug} videoId={current.id} completed={completedIds.has(current.id)} />
                  {prev && (
                    <Link
                      href={href(prev.id)}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-[#d9e1ec] transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4aa3b]"
                    >
                      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                      Previous
                    </Link>
                  )}
                  {next && (
                    <Link
                      href={href(next.id)}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#7D52F4] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#7D52F4]/20 transition hover:-translate-y-0.5 hover:bg-[#6d43e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4aa3b]"
                    >
                      Next lesson
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-[#14233c] shadow-2xl shadow-black/10 lg:sticky lg:top-24">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#e4aa3b] uppercase">Course content</p>
                  <h2 className="mt-2 font-mulish text-xl font-bold">Your learning path</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#d9e1ec]">{progress.percent}%</span>
              </div>
              {progress.total > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-bold text-[#d9e0eb]">
                    <span>{progress.done} of {progress.total} lessons complete</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-linear-to-r from-[#e4aa3b] to-[#f4c766]" style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 p-3 sm:p-4">
              {moduleSections.length ? (
                moduleSections.map(([section, sectionModules], sectionIndex) => {
                  const sectionDone = sectionModules.reduce((total, module) => total + module.done, 0);
                  const sectionTotal = sectionModules.reduce((total, module) => total + module.videos.length, 0);

                  return (
                    <details
                      key={section}
                      open={sectionModules.some((module) => module.videos.some((video) => video.id === current?.id))}
                      className="group/section"
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-white/10 bg-[#0f1d33]/80 p-3 transition hover:border-white/20 hover:bg-[#172846] [&::-webkit-details-marker]:hidden">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#e4aa3b]/15 text-xs font-bold text-[#e4aa3b]">0{sectionIndex + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-white">{section}</span>
                          <span className="mt-0.5 block text-xs text-[#8fa3bf]">{sectionDone} of {sectionTotal} lessons complete</span>
                        </span>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg leading-none text-[#d9e1ec] transition group-open/section:bg-[#7D52F4] group-open/section:text-white group-open/section:rotate-90">›</span>
                      </summary>
                      <div className="mt-2 space-y-2 border-l border-[#e4aa3b]/30 pl-2">
                        {sectionModules.map((m) => (
                          <details key={m.collectionId} open={m.videos.some((x) => x.id === current?.id)} className="group/module rounded-2xl border border-white/10 bg-[#0f1d33]/60">
                            <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 text-sm font-bold text-[#f4f7fb] transition hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs text-[#d9e1ec] transition group-open/module:bg-[#7D52F4] group-open/module:text-white group-open/module:rotate-90">›</span>
                              <span className="min-w-0 flex-1 truncate">{m.title}</span>
                              <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[11px] font-normal text-[#8fa3bf]">{m.done}/{m.videos.length}</span>
                            </summary>
                            <div className="space-y-1 px-2 pb-2">
                              {m.videos.map((video) => {
                                const isDone = completedIds.has(video.id);
                                return (
                                  <Link
                                    key={video.id}
                                    href={href(video.id)}
                                    className={`flex items-center gap-3 rounded-xl p-3 text-sm transition ${video.id === current?.id ? "bg-[#1d2c49] text-white ring-1 ring-[#7D52F4]" : "text-[#b8c7dc] hover:bg-white/5"}`}
                                  >
                                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${isDone ? "bg-[#e4aa3b] text-[#0b1427]" : "border border-white/30"}`}>
                                      {isDone ? "✓" : ""}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate">{video.title}</span>
                                    <span className="shrink-0 text-xs text-[#8fa3bf]">{formatTime(video.seconds)}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </details>
                        ))}
                      </div>
                    </details>
                  );
                })
              ) : (
                <p className="p-2 text-sm leading-6 text-[#b8c7dc]">Modules will be added to your course soon.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default LearnPage;