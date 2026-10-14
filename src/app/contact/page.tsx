"use client";

import { FormEvent, useState } from "react";

const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="bg-[#f3f6f8] py-16 sm:py-24">
      <div className="container grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Get in touch</p><h1 className="mt-4 font-mulish text-5xl leading-tight font-bold text-[#102c63]">Questions before you set sail?</h1><p className="mt-6 max-w-md text-lg leading-8 text-[#526176]">Ask about course access, preparation routes, study material, or student support. Our team will help you choose the right next step.</p><div className="mt-10 border-l-2 border-[#d99a25] pl-5 text-[#273b58]"><p className="font-bold">Future Mariners Foundation</p><p className="mt-2 text-sm leading-6 text-[#526176]">Student support for IMUCET aspirants<br />WhatsApp support available after enrolment</p></div></div>
        <div className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-10">{sent ? <div className="py-12 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f2ed] text-2xl text-[#27734c]">✓</div><h2 className="mt-6 font-mulish text-3xl font-bold text-[#102c63]">Message received</h2><p className="mt-4 leading-7 text-[#526176]">Thanks for reaching out. The support inbox will be connected during the backend setup.</p></div> : <form onSubmit={handleSubmit} className="space-y-5"><label className="block text-sm font-bold text-[#273b58]">Name<input required name="name" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="Your name" /></label><label className="block text-sm font-bold text-[#273b58]">Email<input required type="email" name="email" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="you@example.com" /></label><label className="block text-sm font-bold text-[#273b58]">Message<textarea required name="message" rows={5} className="mt-2 w-full border border-[#d8e0e8] px-4 py-3 outline-none focus:border-[#bd8014]" placeholder="How can we help?" /></label><button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Send message <span className="ml-2">→</span></button></form>}</div>
      </div>
    </main>
  );
};

export default ContactPage;