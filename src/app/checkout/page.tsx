import Link from "next/link";
import CheckoutButton from "@/components/checkoutButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coursesData } from "@/components/courses/courseData";

const CheckoutPage = async ({ searchParams }: { searchParams: Promise<{ course?: string; upgrade?: string }> }) => {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const catalogCourse = coursesData.find((course) => course.slug.current === params.course);
  if (!catalogCourse) redirect("/dashboard/explore");
  const isUpgrade = params.upgrade === "true" && catalogCourse.slug.current === "complete-imucet-preparation";
  const sponsorshipEnrollment = isUpgrade ? await prisma.enrollment.findFirst({ where: { userId: session.user.id, status: "PAID", course: { slug: "imucet-interview-preparation" } } }) : null;
  if (isUpgrade && !sponsorshipEnrollment) redirect("/dashboard/explore");
  const paymentAmount = isUpgrade ? 2600 : catalogCourse.price;
  const course = await prisma.course.upsert({ where: { slug: catalogCourse.slug.current }, update: { title: catalogCourse.title, price: catalogCourse.price }, create: { slug: catalogCourse.slug.current, title: catalogCourse.title, price: catalogCourse.price } });
  const enrollment = await prisma.enrollment.upsert({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } }, update: { paymentAmount }, create: { userId: session.user.id, courseId: course.id, paymentAmount } });
  if (enrollment.status === "PAID") redirect("/dashboard");
  const courseName = course.title;
  return <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-16 sm:py-24"><div className="container max-w-2xl"><div className="bg-white p-8 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-12"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Secure checkout</p><h1 className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">{isUpgrade ? "Upgrade to the complete course." : "Complete your enrolment."}</h1><p className="mt-5 leading-7 text-[#526176]">Pay securely with Razorpay. Your course access will be activated after payment confirmation.</p><div className="mt-8 border-y border-[#e5eaf0] py-6 text-sm leading-7 text-[#526176]"><p>Selected course: <strong className="text-[#102c63]">{courseName}</strong></p><p className="mt-2">Amount: <strong className="text-[#102c63]">₹{paymentAmount.toLocaleString("en-IN")}</strong></p><p className="mt-2">Status: Payment pending</p></div><div className="mt-8"><CheckoutButton courseSlug={params.course ?? "complete-imucet-preparation"} upgrade={isUpgrade} /></div><Link href="/dashboard" className="mt-6 inline-flex text-sm font-bold text-[#102c63]">Return to dashboard</Link></div></div></main>;
};

export default CheckoutPage;