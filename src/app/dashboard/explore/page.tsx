import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { coursesData } from "@/components/courses/courseData";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ExplorePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const paidEnrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, status: "PAID" },
    select: { course: { select: { slug: true } } },
  });
  const purchasedSlugs = new Set(paidEnrollments.map((enrollment) => enrollment.course.slug));
  const availableCourses = coursesData.filter((course) => !purchasedSlugs.has(course.slug.current));

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] text-[#102c63]">
      <section className="border-b border-[#dfe6ed] bg-white">
        <div className="container py-10 sm:py-14">
          <Link href="/dashboard" className="text-sm font-bold text-[#bd8014]">← Back to dashboard</Link>
          <p className="mt-8 text-xs font-bold tracking-[0.2em] text-[#bd8014] uppercase">Explore more learning</p>
          <h1 className="mt-3 max-w-2xl font-mulish text-4xl font-bold leading-tight sm:text-5xl">Choose your next course.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#526176]">Browse courses you have not purchased yet and find the right next step for your maritime career.</p>
        </div>
      </section>

      <section className="container py-8 sm:py-12">
        {availableCourses.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {availableCourses.map((course) => (
              <article key={course._id} className="border border-[#d8e0e8] bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.08)] sm:p-9">
                <p className="text-xs font-bold tracking-[0.18em] text-[#bd8014] uppercase">Future Mariners course</p>
                <h2 className="mt-4 font-mulish text-2xl font-bold leading-tight">{course.title}</h2>
                <p className="mt-4 min-h-14 leading-7 text-[#526176]">{course.shortDescription}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e5eaf0] pt-6">
                  <p className="font-mulish text-2xl font-bold">₹{course.price.toLocaleString("en-IN")} <span className="text-sm font-normal text-[#718096]">one-time</span></p>
                  <Link href={`/courses/${course.slug.current}`} className="inline-flex items-center rounded-md bg-[#102c63] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#273b58]">View course <span className="ml-3 text-[#e4aa3b]">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="border border-[#d8e0e8] bg-white p-8 sm:p-12">
            <p className="text-xs font-bold tracking-[0.18em] text-[#bd8014] uppercase">You are all caught up</p>
            <h2 className="mt-3 font-mulish text-3xl font-bold">You have purchased every course.</h2>
            <p className="mt-3 max-w-xl leading-7 text-[#526176]">Your purchased courses are available from your dashboard whenever you are ready to continue learning.</p>
            <Link href="/dashboard" className="mt-6 inline-flex rounded-md bg-[#102c63] px-5 py-3 text-sm font-bold text-white">Back to dashboard <span className="ml-3 text-[#e4aa3b]">→</span></Link>
          </section>
        )}
      </section>
    </main>
  );
};

export default ExplorePage;
