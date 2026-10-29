import Image from "next/image";
import Link from "next/link";
import ButtonArrow from "../ui/buttonArrow";

const benefits = [
  { icon: "▶", label: "Recorded lectures" },
  { icon: "▤", label: "PDF notes" },
  { icon: "◎", label: "Mock interviews" },
  { icon: "✦", label: "Live doubt support" },
];

const heroButton =
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm tracking-sm font-medium leading-5 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const Hero = () => (
  <section className="relative overflow-hidden bg-[#102c63] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(180deg, transparent 0 97%, #ffffff 97% 98%, transparent 98%)", backgroundSize: "100% 42px" }} />
      <div className="pointer-events-none absolute -top-44 -right-32 size-130 rounded-full border border-[#e4aa3b]/20" />
      <div className="pointer-events-none absolute -bottom-56 -left-24 size-130 rounded-full border border-white/10" />
      <div className="container relative grid min-h-170 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-[#bd8014] uppercase"><span className="h-px w-10 bg-[#bd8014]" /> IMUCET 2027 preparation</p>
          <h1 className="max-w-3xl font-mulish text-5xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-7xl">Prepare Today.<br /><span className="text-[#e4aa3b]">Get Selected Tomorrow.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#d9e1ec] sm:text-xl">Your complete preparation platform for IMU-CET and Merchant Navy Sponsorship.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup" className={`${heroButton} h-11 px-6 py-1.5 pr-1.5 pl-6 text-base tracking-base bg-[#7D52F4] text-primary hover:bg-purple-600 sm:h-12`}><span>Start your preparation</span><ButtonArrow /></Link>
            <Link href="/#courses" className={`${heroButton} h-11 px-6 py-3 text-base tracking-base border border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-[#102c63] sm:h-12`}>Explore courses</Link>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {benefits.map((benefit) => <div key={benefit.label} className="flex items-center gap-2 text-sm font-semibold text-[#c2cfdf]"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-[#e4aa3b]">{benefit.icon}</span><span>{benefit.label}</span></div>)}
          </div>
        </div>
        <div className="relative mx-auto hidden h-97.5 w-full max-w-125 sm:block">
          <div className="absolute top-3 right-2 h-71.25 w-[56%] rotate-[7deg] rounded-2xl border-4 border-white bg-white p-1 shadow-2xl">
            <Image src="/images/hero/img-2.png" alt="Student preparing for a maritime career" fill sizes="(max-width: 1024px) 42vw, 280px" className="rounded-xl object-cover" priority />
          </div>
          <div className="absolute top-16 left-2 h-71.25 w-[56%] -rotate-[7deg] rounded-2xl border-4 border-white bg-white p-1 shadow-2xl">
            <Image src="/images/hero/img-1.png" alt="Student learning for IMU-CET" fill sizes="(max-width: 1024px) 42vw, 280px" className="rounded-xl object-cover" priority />
          </div>
          <div className="absolute right-8 bottom-0 h-55 w-[48%] -rotate-[4deg] rounded-2xl border-4 border-white bg-white p-1 shadow-2xl">
            <Image src="/images/hero/img-3.png" alt="Future mariner preparation" fill sizes="(max-width: 1024px) 36vw, 240px" className="rounded-xl object-cover" />
          </div>
        </div>
        <div className="relative mt-2 grid grid-cols-2 gap-3 sm:hidden">
          {["img-1.png", "img-2.png"].map((image, index) => <div key={image} className={`relative h-40 rounded-xl border-4 border-white bg-white p-1 shadow-xl ${index === 0 ? "-rotate-3" : "rotate-3"}`}><Image src={`/images/hero/${image}`} alt="Future mariner preparation" fill sizes="45vw" className="rounded-lg object-cover" /></div>)}
        </div>
      </div>
    <div className="container relative pb-8"><div className="h-px bg-white/15" /></div>
  </section>
);

export default Hero;