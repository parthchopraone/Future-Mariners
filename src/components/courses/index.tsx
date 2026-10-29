import { coursesData } from "./courseData";
import ButtonArrow from "../ui/buttonArrow";
import LoadingLink from "../ui/loadingLink";

const courseDetails = [
  {
    eyebrow: "01 / Complete pathway",
    title: "Complete IMUCET + Sponsorship Preparation",
    description: "A complete preparation pathway to help aspiring mariners prepare for IMUCET and sponsorship opportunities with confidence.",
    includes: ["Complete IMUCET syllabus coverage", "Recorded lectures and study materials", "Mock tests and practice questions", "Sponsorship exam preparation", "Interview guidance and personality development", "WhatsApp doubt support"],
  },
  {
    eyebrow: "02 / Focused pathway",
    title: "SPONSORSHIP PREPARATION",
    description: "Focused preparation to help aspiring mariners succeed in company sponsorship examinations and interviews.",
    includes: ["Sponsorship exam preparation and practice questions", "Company-specific interview guidance", "Technical and maritime knowledge preparation", "Communication skills and personality development", "Mock interviews with performance feedback", "Guidance for building confidence and interview readiness"],
  },
];

const Courses = () => (
  <section id="courses" className="scroll-mt-24 bg-[#f3f6f8] py-20 sm:py-28">
    <div className="container">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Choose your route</p>
        <h2 className="font-mulish text-4xl leading-tight font-bold text-[#102c63] sm:text-5xl">Two courses. One clear direction.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526176]">Choose the preparation pathway that matches your next step towards a career in the merchant navy.</p>
      </div>
      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
        {coursesData.map((course, index) => (
          <article key={course._id} className="group relative flex h-full flex-col overflow-hidden border border-[#d4dee8] bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,44,99,0.13)] sm:p-9">
            <div className="absolute top-0 right-0 h-28 w-28 bg-[#d99a25] opacity-15 [clip-path:polygon(100%_0,100%_100%,0_0)] transition-opacity group-hover:opacity-25" />
            <div className="relative flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.18em] text-[#bd8014] uppercase">{courseDetails[index].eyebrow}</p>
              <span className="flex size-9 items-center justify-center rounded-full bg-[#f3f6f8] font-mono text-xs font-bold text-[#102c63]">0{index + 1}</span>
            </div>
            <h3 className="relative mt-6 max-w-md font-mulish text-2xl leading-tight font-bold text-[#102c63]">{courseDetails[index].title}</h3>
            <p className="mt-4 max-w-lg leading-7 text-[#526176]">{courseDetails[index].description}</p>
            <ul className="mt-7 grid flex-1 gap-3 border-t border-[#e5eaf0] pt-6 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3">
              {courseDetails[index].includes.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#273b58]"><span className="mt-2 flex size-2 shrink-0 rounded-full bg-[#d99a25]" />{item}</li>)}
            </ul>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-[#e5eaf0] pt-6">
              <p className="font-mulish text-3xl font-bold text-[#102c63]">₹{course.price.toLocaleString("en-IN")} <span className="text-sm font-normal text-[#718096]">one-time</span></p>
              <LoadingLink href="/signup" className="group inline-flex h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-gray-200 bg-transparent px-6 py-3 text-base font-medium leading-5 tracking-base text-secondary shadow-xs transition-colors hover:bg-gray-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-12">Sign up to enroll <ButtonArrow /></LoadingLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Courses;