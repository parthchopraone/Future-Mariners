import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="bg-[#0b214b] text-white">
    <div className="container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <div>
        <Image src="/images/logo.jpg" width={768} height={1152} alt="Future Mariners Foundation" className="size-20 rounded-full object-cover" />
        <h2 className="mt-6 font-mulish text-2xl font-bold">Future Mariners Foundation</h2>
        <p className="mt-4 max-w-sm leading-7 text-[#b8c7dc]">Disciplined online preparation for IMUCET aspirants who are ready to chart their course.</p>
      </div>
      <div><h3 className="font-bold text-[#e4aa3b]">Explore</h3><ul className="mt-5 space-y-3 text-sm text-[#b8c7dc]"><li><Link href="/#courses" className="hover:text-white">Our courses</Link></li><li><Link href="/#why-us" className="hover:text-white">Why Future Mariners</Link></li><li><Link href="/#faq" className="hover:text-white">FAQs</Link></li></ul></div>
      <div><h3 className="font-bold text-[#e4aa3b]">Student access</h3><ul className="mt-5 space-y-3 text-sm text-[#b8c7dc]"><li><Link href="/signup" className="hover:text-white">Create account</Link></li><li><Link href="/login" className="hover:text-white">Sign in</Link></li><li>WhatsApp support after enrolment</li></ul></div>
    </div>
    <div className="border-t border-white/10"><div className="container py-5 text-sm text-[#8fa3bf]">© {new Date().getFullYear()} Future Mariners Foundation. Built for the next watch.</div></div>
  </footer>
);

export default Footer;