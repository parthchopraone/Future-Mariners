import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WhatsApp } from "@/lib/icons";
import { getCourseProgress, type CourseProgress } from "@/lib/courseProgress";

// One button style set for the whole dashboard: same size, shape and arrow.
const btn = "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-bold transition";
const btnPrimary = `${btn} bg-[#7d52f4] text-white hover:bg-[#936ff7]`;
const btnOutline = `${btn} border border-[#cfd5df] text-[#17233d] hover:border-[#17233d] hover:bg-[#17233d] hover:text-white`;
const btnPending = `${btn} border border-[#f0b429] bg-[#fff8e6] text-[#8a6100] hover:bg-[#fff0c7]`;
const Arrow = () => <span aria-hidden className="ml-2">→</span>;

// Both quick-action cards share the same shape and size.
const actionCard = "flex items-center gap-4 rounded-xl px-6 py-5 font-bold text-white shadow-sm transition";

// How many modules to show in the dashboard panel.
const MODULE_WINDOW = 4;

const emptyProgress: CourseProgress = {
  modules: [], total: 0, done: 0, percent: 0, completedIds: new Set(), nextVideo: null, loadError: false,
};

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  const paid = enrollments.filter((e) => e.status === "PAID");

  // Real progress for every paid course: Bunny modules + this student's completed lessons.
  const progressList = await Promise.all(paid.map((e) => getCourseProgress(userId, e.courseId, e.course.slug)));
  const progressById = new Map(paid.map((e, i) => [e.id, progressList[i]]));
  const progressOf = (id: string) => progressById.get(id) ?? emptyProgress;

  const hasCompleteCourse = paid.some((e) => e.course.slug === "complete-imucet-preparation");
  const hasSponsorshipCourse = paid.some((e) => e.course.slug === "imucet-interview-preparation");
  const activeEnrollment = paid.find((e) => progressOf(e.id).percent < 100) ?? paid[0];
  const active = activeEnrollment ? progressOf(activeEnrollment.id) : emptyProgress;

  const totalLessonsCompleted = progressList.reduce((t, p) => t + p.done, 0);
  const averageProgress = paid.length ? Math.round(progressList.reduce((t, p) => t + p.percent, 0) / paid.length) : 0;
  const firstName = session.user.name?.split(" ")[0] ?? "Student";

  const stats = [
    { label: "Courses enrolled", value: paid.length },
    { label: "Lessons completed", value: totalLessonsCompleted },
    { label: "Average progress", value: `${averageProgress}%` },
  ];

  const startedAnything = active.done > 0;
  const resumeHref = activeEnrollment
    ? `/learn/${activeEnrollment.course.slug}${active.nextVideo ? `?v=${active.nextVideo.id}` : ""}`
    : "/dashboard";
  const courseDone = active.total > 0 && active.percent === 100;

  // Show only 4 modules, starting from the one the student is on.
  // If they are on one of the last modules, show the last 4.
  const modules = active.modules;
  const currentIdx = active.nextVideo
    ? modules.findIndex((m) => m.videos.some((v) => v.id === active.nextVideo?.id))
    : modules.length - 1;
  const windowStart = Math.max(0, Math.min(currentIdx, modules.length - MODULE_WINDOW));
  const visibleModules = modules.slice(windowStart, windowStart + MODULE_WINDOW);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f8fa] text-[#17233d]">
      <section className="border-b border-[#e7eaf0] bg-white">
        <div className="container py-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-mulish text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Keep going, {firstName}.</h1>
              <p className="mt-2 max-w-xl text-base leading-7 text-[#687286]">
                Build your maritime career one focused lesson at a time.
              </p>
            </div>
            {!hasCompleteCourse && (
              <Link href="/dashboard/explore" className={`${btnOutline} w-fit`}>
                {hasSponsorshipCourse ? "Upgrade to complete course" : "Explore courses"}
                <Arrow />
              </Link>
            )}
          </div>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-[#e7eaf0] rounded-xl border border-[#e7eaf0] bg-[#fbfbfd]">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 sm:px-6 sm:py-5">
                <dd className="font-mulish text-2xl font-bold sm:text-3xl">{stat.value}</dd>
                <dt className="mt-1 text-xs text-[#687286] sm:text-sm">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container space-y-12 py-8 sm:py-12">
        {activeEnrollment ? (
          <section className="overflow-hidden rounded-xl bg-[#17233d] text-white shadow-[0_18px_45px_rgba(23,35,61,0.16)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col p-7 sm:p-10">
                <p className="text-sm font-bold text-[#f0b429]">{courseDone ? "Course complete" : "Continue learning"}</p>
                <h2 className="mt-3 font-mulish text-3xl font-bold sm:text-4xl">{activeEnrollment.course.title}</h2>
                <p className="mt-2 text-sm text-[#b8c3d5]">
                  {active.total
                    ? `${active.done} of ${active.total} lessons complete`
                    : active.loadError
                      ? "We could not load your lessons right now"
                      : "Your lessons are being added"}
                </p>

                <div className="mt-8">
                  <div className="flex items-center justify-between text-xs font-bold text-[#d9e0eb]">
                    <span>Course progress</span>
                    <span>{active.percent}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-[#f0b429]" style={{ width: `${active.percent}%` }} />
                  </div>
                </div>

                {active.nextVideo && (
                  <p className="mt-6 text-sm text-[#b8c3d5]">
                    {startedAnything ? "Up next" : "Start with"}: <span className="font-bold text-white">{active.nextVideo.title}</span>
                  </p>
                )}

                <Link href={resumeHref} className={`${btnPrimary} mt-6 w-fit`}>
                  {courseDone ? "Review course" : startedAnything ? "Resume course" : "Start course"}
                  <Arrow />
                </Link>
              </div>

              {/* Module-by-module progress: 4 modules, starting from the current one */}
              <div className="border-t border-white/10 bg-[linear-gradient(135deg,#283b61,#1b2946)] p-7 sm:p-10 lg:border-t-0 lg:border-l">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm font-bold text-[#d9e0eb]">Your modules</h3>
                  {modules.length > MODULE_WINDOW && (
                    <span className="text-xs text-[#b8c3d5]">
                      {windowStart + 1}–{windowStart + visibleModules.length} of {modules.length}
                    </span>
                  )}
                </div>

                {visibleModules.length ? (
                  <>
                    <ol className="mt-4 space-y-2">
                      {visibleModules.map((m, i) => {
                        const index = windowStart + i;
                        const hasVideos = m.videos.length > 0;
                        const complete = hasVideos && m.done === m.videos.length;
                        const isCurrent = index === currentIdx && !courseDone;
                        const pct = hasVideos ? Math.round((m.done / m.videos.length) * 100) : 0;
                        return (
                          <li
                            key={m.collectionId}
                            className={`rounded-lg px-4 py-3 text-sm ${isCurrent ? "bg-white/12 ring-1 ring-[#f0b429]/60" : "bg-white/5"}`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  complete ? "bg-[#f0b429] text-[#17233d]" : isCurrent ? "border border-[#f0b429] text-[#f0b429]" : "border border-white/25 text-white/50"
                                }`}
                              >
                                {complete ? "✓" : index + 1}
                              </span>
                              <span className={`min-w-0 flex-1 truncate ${hasVideos ? "text-white" : "text-[#b8c3d5]"}`}>{m.title}</span>
                              <span className="shrink-0 text-xs text-[#b8c3d5]">{hasVideos ? `${m.done}/${m.videos.length}` : "Coming soon"}</span>
                            </div>
                            {hasVideos && (
                              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
                                <div className="h-full rounded-full bg-[#f0b429]" style={{ width: `${pct}%` }} />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                    {modules.length > MODULE_WINDOW && (
                      <Link href={`/learn/${activeEnrollment.course.slug}`} className="mt-4 inline-block text-xs font-bold text-[#f0b429] hover:underline">
                        View all {modules.length} modules →
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[#b8c3d5]">Modules for this course will appear here soon.</p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-[#cfd5df] bg-white p-8 sm:p-12">
            <h2 className="font-mulish text-3xl font-bold">Choose your first course</h2>
            <p className="mt-3 max-w-xl leading-7 text-[#687286]">
              Your enrolled courses and progress will appear here after you select a programme.
            </p>
            <Link href="/dashboard/explore" className={`${btnPrimary} mt-6 w-fit`}>
              {hasSponsorshipCourse ? "Upgrade to complete course" : "Browse courses"}
              <Arrow />
            </Link>
          </section>
        )}

        {paid.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2">
            <a
              href={"https://chat.whatsapp.com/H7or5WdwgAvBOVnkhXEjSg"}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionCard} bg-[#25D366] hover:bg-[#1fb957]`}
            >
              <WhatsApp className="size-7" />
              <span>Join WhatsApp support</span>
              <span aria-hidden className="ml-auto">→</span>
            </a>
            <Link href="/doubts" className={`${actionCard} bg-[#17233d] hover:bg-[#273b58]`}>
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-white text-sm">?</span>
              <span>Submit a doubt</span>
              <span aria-hidden className="ml-auto">→</span>
            </Link>
          </section>
        )}

        <section>
          <h2 className="border-b border-[#dfe3e9] pb-4 font-mulish text-2xl font-bold sm:text-3xl">My courses</h2>

          {enrollments.length ? (
            <ul className="mt-6 space-y-4">
              {enrollments.map((enrollment) => {
                const isPaid = enrollment.status === "PAID";
                const p = isPaid ? progressOf(enrollment.id) : emptyProgress;
                const href = `/learn/${enrollment.course.slug}${p.nextVideo ? `?v=${p.nextVideo.id}` : ""}`;

                return (
                  <li
                    key={enrollment.id}
                    className="flex flex-col gap-5 rounded-xl border border-[#e3e6ec] bg-white p-5 transition hover:border-[#b5a5f5] sm:flex-row sm:items-center sm:gap-6"
                  >
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(#7d52f4 ${p.percent}%, #e9ebf1 0)` }}
                      aria-label={`${p.percent}% complete`}
                    >
                      <div className="flex size-13 items-center justify-center rounded-full bg-white text-sm font-bold">{p.percent}%</div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-mulish text-xl font-bold">{enrollment.course.title}</h3>
                      <p className="mt-1 text-sm text-[#687286]">
                        {!isPaid ? "Payment pending" : p.total ? `${p.done} of ${p.total} lessons complete` : "Lessons coming soon"}
                      </p>
                    </div>

                    {isPaid ? (
                      <Link href={href} className={`${btnPrimary} w-full sm:w-auto`}>
                        {p.total && p.percent === 100 ? "Review" : p.done ? "Continue" : "Start"}
                        <Arrow />
                      </Link>
                    ) : (
                      <Link href={`/checkout?course=${enrollment.course.slug}`} className={`${btnPending} w-full sm:w-auto`}>
                        Complete payment
                        <Arrow />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-[#687286]">No courses yet. Explore the catalogue to begin.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;