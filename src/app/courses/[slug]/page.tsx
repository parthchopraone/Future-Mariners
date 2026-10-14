import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coursesData } from "@/components/courses/courseData";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const details: Record<string, { points: string[]; overview: string }> = {
  "complete-imucet-preparation": { points: ["Recorded lessons for structured self-paced study", "Study material available until IMUCET 2027", "Website and WhatsApp doubt support", "Google Meet live guidance when scheduled"], overview: "Build your complete IMUCET preparation plan with a clear route through the subjects, practice, revision, and support you need as an aspirant." },
  "imucet-interview-preparation": { points: ["Recorded interview preparation lessons", "Personal introduction and answer structure", "Maritime awareness and confidence practice", "Guidance for calm, clear responses"], overview: "Prepare for the interview stage with focused practice that helps you understand your story, communicate clearly, and show up with confidence." },
};

const CourseDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const course = coursesData.find((item) => item.slug.current === slug);
  const content = details[slug];
  if (!course || !content) notFound();
  const session = await getServerSession(authOptions);
  const accessHref = session?.user?.id ? `/checkout?course=${course.slug.current}` : `/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug.current}`)}`;
  const accessLabel = session?.user?.id ? "Continue to payment" : "Sign in to enrol";

  return (
    <main className="bg-[#f3f6f8] py-14 sm:py-24">
      <div className="container grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <Link href="/#courses" className="text-sm font-bold text-[#bd8014]">← Back to courses</Link>
          <div className="mt-10 max-w-3xl"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Future Mariners Foundation</p><h1 className="mt-4 font-mulish text-5xl leading-tight font-bold text-[#102c63] sm:text-6xl">{course.title}</h1><p className="mt-6 text-xl leading-8 text-[#526176]">{course.shortDescription}</p></div>
          <div className="mt-12 bg-[#102c63] p-2"><Image src="/images/logo.jpg" width={768} height={1152} alt="Future Mariners Foundation" className="h-72 w-full object-cover object-center sm:h-96" /></div>
          <section className="mt-12"><h2 className="font-mulish text-3xl font-bold text-[#102c63]">What you will get</h2><p className="mt-5 max-w-2xl leading-8 text-[#526176]">{content.overview}</p><ul className="mt-8 grid gap-4 sm:grid-cols-2">{content.points.map((point) => <li key={point} className="border-t-2 border-[#d99a25] pt-4 font-medium leading-7 text-[#273b58]">{point}</li>)}</ul></section>
        </div>
        <aside className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.1)] lg:sticky lg:top-24"><p className="text-sm font-bold tracking-[0.18em] text-[#bd8014] uppercase">Course fee</p><p className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">₹{course.price.toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-[#718096]">One-time payment. Access until IMUCET 2027.</p><div className="my-7 border-t border-[#e5eaf0]" /><p className="font-bold text-[#102c63]">Included with enrolment</p><ul className="mt-4 space-y-3 text-sm leading-6 text-[#526176]"><li>✓ Recorded course access</li><li>✓ Downloadable study material</li><li>✓ Website doubt support</li><li>✓ WhatsApp group support</li></ul><Button asChild size="lg" className="mt-8 w-full py-1.5 pr-1.5 pl-6"><Link href={accessHref}><span className="w-full text-center">{accessLabel}</span><ButtonArrow /></Link></Button></aside>
      </div>
    </main>
  );
};

export default CourseDetails;