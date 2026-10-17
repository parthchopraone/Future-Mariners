import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseModules } from "@/config/courseModules";
import { getBunnyEmbedUrl, getCollectionModule, hasBunnyApiKey, type BunnyModule } from "@/lib/bunny";

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

  // Only paid students get in.
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, status: "PAID", course: { slug } },
    include: { course: true },
  });
  if (!enrollment) redirect(`/checkout?course=${slug}`);
  if (!enrollment.course) notFound();

  // Load modules (Bunny collections) for this course.
  let modules: BunnyModule[] = [];
  let loadError = false;
  const configured = courseModules[slug] ?? [];
  if (configured.length && hasBunnyApiKey()) {
    try {
      modules = await Promise.all(configured.map((m) => getCollectionModule(m.collectionId, m.title)));
    } catch {
      loadError = true;
    }
  }

  // Flat list in module order. The requested video must be one of these, so a
  // student cannot play videos that are not part of their course.
  const flat = modules.flatMap((m) => m.videos.map((video) => ({ ...video, moduleTitle: m.title })));
  const index = Math.max(0, flat.findIndex((x) => x.id === v));
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
                <div className="mt-6 flex gap-3">
                  {prev && <Link href={href(prev.id)} className="border border-white/20 px-5 py-2.5 text-sm font-bold">← Previous lesson</Link>}
                  {next && <Link href={href(next.id)} className="bg-[#7D52F4] px-5 py-2.5 text-sm font-bold">Next lesson →</Link>}
                </div>
              </>
            )}
          </section>

          <aside className="h-fit bg-[#14233c] p-6">
            <p className="text-sm font-bold tracking-[0.16em] text-[#e4aa3b] uppercase">Course content</p>
            <div className="mt-5 space-y-3">
              {modules.length ? (
                modules.map((m) => (
                  <details key={m.collectionId} open={m.videos.some((x) => x.id === current?.id)} className="border border-white/10">
                    <summary className="cursor-pointer p-4 font-bold">
                      {m.title} <span className="font-normal text-[#8fa3bf]">({m.videos.length})</span>
                    </summary>
                    <div className="space-y-1 px-2 pb-2">
                      {m.videos.map((video) => (
                        <Link
                          key={video.id}
                          href={href(video.id)}
                          className={`flex items-center justify-between gap-3 p-3 text-sm ${video.id === current?.id ? "bg-[#1d2c49] text-white ring-1 ring-[#7D52F4]" : "text-[#b8c7dc] hover:bg-white/5"}`}
                        >
                          <span>{video.title}</span>
                          <span className="shrink-0 text-xs text-[#8fa3bf]">{formatTime(video.seconds)}</span>
                        </Link>
                      ))}
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