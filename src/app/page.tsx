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
  keywords: ["IMUCET preparation", "IMUCET interview preparation", "Future Mariners"],
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
      <section id="why-us" className="bg-white py-20 sm:py-28">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Built for the journey</p>
            <h2 className="font-mulish text-4xl leading-tight font-bold text-[#102c63]">Steady preparation beats last-minute panic.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[{ title: "Learn on your time", text: "Recorded lessons keep your preparation flexible around school and college." }, { title: "Stay supported", text: "Ask questions through the website and your dedicated WhatsApp group." }, { title: "Keep your bearings", text: "Follow a clear route with study material available until IMUCET 2027." }].map((item, index) => <div key={item.title} className="border-t-2 border-[#d99a25] pt-5"><span className="font-mono text-xs font-bold text-[#bd8014]">0{index + 1}</span><h3 className="mt-4 font-mulish text-xl font-bold text-[#102c63]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#526176]">{item.text}</p></div>)}
          </div>
        </div>
      </section>
      <section id="faq" className="bg-[#f3f6f8] py-20 sm:py-28">
        <div className="container max-w-4xl">
          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Before you enrol</p>
          <h2 className="font-mulish text-4xl font-bold text-[#102c63]">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-[#d8e0e8] border-y border-[#d8e0e8]">{[{ q: "Are the lessons live or recorded?", a: "The core course is recorded. Students will also be supported through a WhatsApp group, with Google Meet sessions when live guidance is scheduled." }, { q: "How long do I get access?", a: "Your study material and course access are planned to remain available until IMUCET 2027." }, { q: "Can I enrol in only the interview course?", a: "Yes. The interview preparation course is a standalone option for students who only need focused interview guidance." }].map((item) => <details key={item.q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-mulish text-lg font-bold text-[#102c63]">{item.q}<span className="text-2xl font-normal text-[#bd8014] transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl leading-7 text-[#526176]">{item.a}</p></details>)}</div>
        </div>
      </section>
    </main>
  );
};

export default Home;
