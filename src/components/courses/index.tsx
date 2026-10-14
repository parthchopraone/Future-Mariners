import Link from "next/link";
import { coursesData } from "./courseData";
import Button from "../ui/button";
import ButtonArrow from "../ui/buttonArrow";

const courseDetails = [
  { eyebrow: "01 / Complete pathway", includes: ["Recorded preparation lessons", "Study material until IMUCET 2027", "Doubt support on the website and WhatsApp"] },
  { eyebrow: "02 / Focused pathway", includes: ["Interview-focused recorded lessons", "Personal introduction and maritime awareness practice", "Guidance for confident answers"] },
];

const Courses = () => (
  <section id="courses" className="bg-[#f3f6f8] py-20 sm:py-28">
    <div className="container">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Choose your route</p>
        <h2 className="font-mulish text-4xl leading-tight font-bold text-[#102c63] sm:text-5xl">Two courses. One clear direction.</h2>
        <p className="mt-5 text-lg leading-8 text-[#526176]">Focused preparation for students who want a disciplined start in the merchant navy.</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {coursesData.map((course, index) => (
          <article key={course._id} className="relative overflow-hidden border border-[#d8e0e8] bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.08)] sm:p-9">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#d99a25] opacity-15 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
            <p className="text-xs font-bold tracking-[0.18em] text-[#bd8014] uppercase">{courseDetails[index].eyebrow}</p>
            <h3 className="mt-5 max-w-md font-mulish text-2xl leading-tight font-bold text-[#102c63]">{course.title}</h3>
            <p className="mt-4 max-w-lg leading-7 text-[#526176]">{course.shortDescription}</p>
            <ul className="mt-7 space-y-3 border-t border-[#e5eaf0] pt-6">
              {courseDetails[index].includes.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#273b58]"><span className="mt-2 size-2 shrink-0 rounded-full bg-[#d99a25]" />{item}</li>)}
            </ul>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-[#e5eaf0] pt-6">
              <p className="font-mulish text-3xl font-bold text-[#102c63]">₹{course.price.toLocaleString("en-IN")} <span className="text-sm font-normal text-[#718096]">one-time</span></p>
              <Button asChild variant="outline" size="lg"><Link href={`/courses/${course.slug.current}`}>View course <ButtonArrow /></Link></Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Courses;