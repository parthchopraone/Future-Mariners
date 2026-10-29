import BackLink from "@/components/ui/backLink";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My account" };

const AccountPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { enrollments: { where: { status: "PAID" }, include: { course: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!user) redirect("/login");

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-12 text-[#102c63] sm:py-20">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-[#d8e0e8] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Student account</p><h1 className="mt-3 font-mulish text-4xl font-bold">My account</h1><p className="mt-3 text-[#526176]">Manage your profile and view your course payment history.</p></div>
          <BackLink href="/dashboard">Back to dashboard</BackLink>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.08)] sm:p-9"><h2 className="font-mulish text-2xl font-bold">Personal information</h2><dl className="mt-6 space-y-5 text-sm"><div><dt className="font-bold text-[#718096]">Full name</dt><dd className="mt-1">{user.name ?? "Not provided"}</dd></div><div><dt className="font-bold text-[#718096]">Email address</dt><dd className="mt-1">{user.email ?? "Not provided"}</dd></div><div><dt className="font-bold text-[#718096]">Phone number</dt><dd className="mt-1">{user.phone ?? "Not provided"}</dd></div><div><dt className="font-bold text-[#718096]">Member since</dt><dd className="mt-1">{user.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd></div></dl></section>
          <section className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.08)] sm:p-9"><h2 className="font-mulish text-2xl font-bold">Billing details</h2>{user.enrollments.length ? <div className="mt-6 space-y-5">{user.enrollments.map((enrollment) => <article key={enrollment.id} className="border-t border-[#e5eaf0] pt-5"><h3 className="font-bold">{enrollment.course.title}</h3><dl className="mt-3 space-y-2 text-sm text-[#526176]"><div className="flex justify-between gap-4"><dt>Amount paid</dt><dd className="font-bold text-[#102c63]">₹{enrollment.course.price.toLocaleString("en-IN")}</dd></div><div className="flex justify-between gap-4"><dt>Paid on</dt><dd>{enrollment.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</dd></div><div className="flex justify-between gap-4"><dt>Payment ID</dt><dd className="max-w-44 truncate" title={enrollment.razorpayPaymentId ?? undefined}>{enrollment.razorpayPaymentId ?? "Processing"}</dd></div></dl></article>)}</div> : <p className="mt-6 leading-7 text-[#526176]">No completed payments yet. Your billing history will appear here after you purchase a course.</p>}</section>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;