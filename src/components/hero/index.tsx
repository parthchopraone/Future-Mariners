import Image from "next/image";
import Link from "next/link";
import Button from "../ui/button";
import ButtonArrow from "../ui/buttonArrow";

const Hero = () => (
  <section className="relative overflow-hidden bg-[#102c63] text-white">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(120deg, transparent 0 48%, #d99a25 48% 49%, transparent 49%), linear-gradient(180deg, transparent 0 94%, #ffffff 94% 95%, transparent 95%)", backgroundSize: "100% 100%, 100% 42px" }} />
    <div className="container relative grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
      <div>
        <p className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.22em] text-[#e4aa3b] uppercase"><span className="h-px w-10 bg-[#e4aa3b]" /> IMUCET 2027 preparation</p>
        <h1 className="max-w-3xl font-mulish text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">Prepare with purpose.<br /><span className="text-[#e4aa3b]">Sail with confidence.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#d9e1ec] sm:text-xl">Future Mariners Foundation helps IMUCET aspirants build the knowledge, discipline, and confidence needed for their next step at sea.</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="py-1.5 pr-1.5 pl-6"><Link href="/signup"><span>Start your preparation</span><ButtonArrow /></Link></Button>
          <Button asChild variant="outline" size="lg" className="border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-[#102c63]"><Link href="#courses">Explore both courses</Link></Button>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#c2cfdf]"><span>Recorded lessons</span><span>•</span><span>Study material till IMUCET 2027</span><span>•</span><span>WhatsApp doubt support</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-[380px]">
        <div className="absolute -inset-6 border border-[#d99a25]/40" />
        <div className="relative bg-white p-5 shadow-2xl">
          <Image src="/images/logo.jpg" width={768} height={1152} alt="Future Mariners Foundation emblem" className="h-auto w-full" priority />
          <div className="absolute right-0 bottom-0 left-0 bg-[#102c63]/95 px-5 py-4 text-center text-xs font-bold tracking-[0.18em] text-[#e4aa3b] uppercase">Your course. Your compass. Your future.</div>
        </div>
      </div>
    </div>
    <div className="container relative pb-16 sm:pb-24">
      <div className="mx-auto grid max-w-[1048px] grid-cols-2 items-end gap-4 lg:grid-cols-4">
        {["img-1.png", "img-2.png", "img-3.png", "img-4.png"].map((image, index) => (
          <div key={image} className={`relative h-[220px] rounded-[14px] border-4 border-white bg-white p-1 shadow-2xl sm:h-[272px] ${index % 2 === 0 ? "rotate-[7deg]" : "-rotate-[7deg]"} ${index > 1 ? "hidden sm:block" : ""}`}>
            <Image width={261} height={272} sizes="100vw" src={`/images/hero/${image}`} alt="IMUCET preparation student" className="h-full w-full rounded-[10px] object-cover" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;