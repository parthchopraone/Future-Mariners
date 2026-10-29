import Hero from "@/components/hero";
import Courses from "@/components/courses";
import Features from "@/components/features";
import { siteName, siteUrl } from "@/utils/envExport";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: `IMUCET Preparation | ${siteName}`,
  description: "Disciplined IMUCET preparation for aspiring future mariners.",
  keywords: ["IMUCET preparation", "sponsorship preparation", "Future Mariners"],
  alternates: {
    canonical: `${siteUrl}`,
  },
  openGraph: {
    title: "Future Mariners Foundation | IMUCET Preparation",
    description: "Prepare with purpose. Sail with confidence.",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Future Mariners Foundation",
      },
    ],
  },

  twitter: {
    title: "Future Mariners Foundation | IMUCET Preparation",
    description: "Prepare with purpose. Sail with confidence.",
    card: "summary_large_image",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Future Mariners Foundation",
      },
    ],
  },
};

const Home = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/dashboard");

  return (
    <main>
      <Hero />
      <Courses />
      <Features />
      <section id="faq" className="bg-[#f3f6f8] py-20 sm:py-28">
        <div className="container max-w-4xl">
          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Before you enrol</p>
          <h2 className="font-mulish text-4xl font-bold text-[#102c63]">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-[#d8e0e8] border-y border-[#d8e0e8]">{[
            { q: "Are the classes live or recorded?", a: "Our courses include recorded lectures that students can access at their convenience. Live guidance sessions may also be conducted through Google Meet, with additional support through our WhatsApp group." },
            { q: "How long will I have access to the course?", a: "Course access and study materials will remain available until IMU-CET 2027, as specified in your course enrolment details." },
            { q: "Can I enrol only for Sponsorship Preparation?", a: "Yes! You can enrol in our standalone Sponsorship Preparation course if you need focused guidance for sponsorship examinations and interviews." },
            { q: "Does FMF provide interview preparation?", a: "Yes. Our preparation includes mock interviews, communication skills, personality development, and guidance to help you approach sponsorship interviews with confidence." },
            { q: "Will I receive study materials and practice questions?", a: "Yes. Our learning resources are designed to support your preparation through study materials, practice questions, and revision." },
            { q: "How can I ask questions if I have doubts?", a: "Students can seek support through the designated Future Mariners Foundation WhatsApp group and scheduled guidance sessions." },
            { q: "Does enrolment guarantee sponsorship or placement?", a: "No. FMF provides preparation, learning resources, and guidance. Selection and sponsorship depend on the student’s performance and the respective company’s eligibility criteria and recruitment process." },
          ].map((item) => <details key={item.q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-mulish text-lg font-bold text-[#102c63]">{item.q}<span className="text-2xl font-normal text-[#bd8014] transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl leading-7 text-[#526176]">{item.a}</p></details>)}</div>
        </div>
      </section>
    </main>
  );
};

export default Home;
