import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const lessonsDone = (lessonCount: number, progress: number) => Math.round((lessonCount * progress) / 100);

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: { course: { include: { lessons: { orderBy: { sortOrder: "asc" } } } } },
    orderBy: { createdAt: "desc" },
  });

  const paid = enrollments.filter((e) => e.status === "PAID");
  const activeEnrollment = paid.find((e) => e.progress < 100) ?? paid[0];

  const totalLessonsCompleted = enrollments.reduce(
    (total, e) => total + lessonsDone(e.course.lessons.length, e.progress),
    0,
  );
  const averageProgress = paid.length ? Math.round(paid.reduce((t, e) => t + e.progress, 0) / paid.length) : 0;
  const firstName = session.user.name?.split(" ")[0] ?? "Student";

  const stats = [
    { label: "Courses enrolled", value: paid.length },
    { label: "Lessons completed", value: totalLessonsCompleted },
    { label: "Average progress", value: `${averageProgress}%` },
  ];

  // Lesson window for the "Up next" panel
  const activeLessons = activeEnrollment?.course.lessons ?? [];
  const activeDone = activeEnrollment ? lessonsDone(activeLessons.length, activeEnrollment.progress) : 0;
  const windowStart = Math.min(Math.max(activeDone - 1, 0), Math.max(activeLessons.length - 4, 0));
  const visibleLessons = activeLessons.slice(windowStart, windowStart + 4);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f8fa] text-[#17233d]">
      {/* Header: greeting + at-a-glance stats */}
      <section className="border-b border-[#e7eaf0] bg-white">
        <div className="container py-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-mulish text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Keep going, {firstName}.</h1>
              <p className="mt-2 max-w-xl text-base leading-7 text-[#687286]">
                Build your maritime career one focused lesson at a time.
              </p>
            </div>
            <Link
              href="/dashboard/explore"
              className="inline-flex w-fit items-center rounded-md border border-[#cfd5df] px-5 py-3 text-sm font-bold text-[#17233d] transition hover:border-[#17233d] hover:bg-[#17233d] hover:text-white"
            >
              Explore courses
            </Link>
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
        {/* Continue learning */}
        {activeEnrollment ? (
          <section className="overflow-hidden rounded-xl bg-[#17233d] text-white shadow-[0_18px_45px_rgba(23,35,61,0.16)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col p-7 sm:p-10">
                <p className="text-sm font-bold text-[#f0b429]">Continue learning</p>
                <h2 className="mt-3 font-mulish text-3xl font-bold sm:text-4xl">{activeEnrollment.course.title}</h2>
                <p className="mt-2 text-sm text-[#b8c3d5]">
                  {activeLessons.length
                    ? `${activeDone} of ${activeLessons.length} lessons complete`
                    : "Your course is ready for your first lesson"}
                </p>

                <div className="mt-8">
                  <div className="flex items-center justify-between text-xs font-bold text-[#d9e0eb]">
                    <span>Course progress</span>
                    <span>{activeEnrollment.progress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-[#f0b429]" style={{ width: `${activeEnrollment.progress}%` }} />
                  </div>
                </div>

                <Link
                  href={`/learn/${activeEnrollment.course.slug}`}
                  className="mt-8 inline-flex w-fit items-center rounded-md bg-[#7d52f4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#936ff7]"
                >
                  {activeEnrollment.progress ? "Resume course" : "Start course"}
                  <span className="ml-3">→</span>
                </Link>
              </div>

              {/* Replaces the duplicated "42%" panel with something useful */}
              <div className="border-t border-white/10 bg-[linear-gradient(135deg,#283b61,#1b2946)] p-7 sm:p-10 lg:border-t-0 lg:border-l">
                <h3 className="text-sm font-bold text-[#d9e0eb]">Your lessons</h3>
                {visibleLessons.length ? (
                  <ol className="mt-4 space-y-2">
                    {visibleLessons.map((lesson, i) => {
                      const index = windowStart + i;
                      const state = index < activeDone ? "done" : index === activeDone ? "next" : "upcoming";
                      return (
                        <li
                          key={lesson.id}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                            state === "next" ? "bg-white/12 ring-1 ring-[#f0b429]/60" : "bg-white/5"
                          }`}
                        >
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              state === "done"
                                ? "bg-[#f0b429] text-[#17233d]"
                                : state === "next"
                                  ? "border border-[#f0b429] text-[#f0b429]"
                                  : "border border-white/25 text-white/50"
                            }`}
                          >
                            {state === "done" ? "✓" : index + 1}
                          </span>
                          <span className={`min-w-0 flex-1 truncate ${state === "upcoming" ? "text-[#b8c3d5]" : "text-white"}`}>
                            {lesson.title}
                          </span>
                          {state === "next" && <span className="text-xs font-bold text-[#f0b429]">Up next</span>}
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[#b8c3d5]">Lessons for this course will appear here soon.</p>
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
            <Link href="/dashboard/explore" className="mt-6 inline-flex rounded-md bg-[#17233d] px-5 py-3 text-sm font-bold text-white">
              Browse courses <span className="ml-3 text-[#f0b429]">→</span>
            </Link>
          </section>
        )}

        {/* Library: full-width rows scale cleanly from 1 to many courses */}
        <section>
          <h2 className="border-b border-[#dfe3e9] pb-4 font-mulish text-2xl font-bold sm:text-3xl">My courses</h2>

          {enrollments.length ? (
            <ul className="mt-6 space-y-4">
              {enrollments.map((enrollment) => {
                const lessonCount = enrollment.course.lessons.length;
                const done = lessonsDone(lessonCount, enrollment.progress);
                const isPaid = enrollment.status === "PAID";

                return (
                  <li
                    key={enrollment.id}
                    className="flex flex-col gap-5 rounded-xl border border-[#e3e6ec] bg-white p-5 transition hover:border-[#b5a5f5] sm:flex-row sm:items-center sm:gap-6"
                  >
                    {/* Progress ring */}
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(#7d52f4 ${enrollment.progress}%, #e9ebf1 0)` }}
                      aria-label={`${enrollment.progress}% complete`}
                    >
                      <div className="flex size-13 items-center justify-center rounded-full bg-white text-sm font-bold">
                        {enrollment.progress}%
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-mulish text-xl font-bold">{enrollment.course.title}</h3>
                      <p className="mt-1 text-sm text-[#687286]">
                        {lessonCount ? `${done} of ${lessonCount} lessons complete` : "Lessons coming soon"}
                      </p>
                    </div>

                    {isPaid ? (
                      <Link
                        href={`/learn/${enrollment.course.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-md bg-[#7d52f4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#936ff7] sm:w-auto"
                      >
                        {enrollment.progress ? "Continue" : "Start"}
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?course=${enrollment.course.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-md border border-[#f0b429] bg-[#fff8e6] px-5 py-2.5 text-sm font-bold text-[#8a6100] transition hover:bg-[#fff0c7] sm:w-auto"
                      >
                        Complete payment
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