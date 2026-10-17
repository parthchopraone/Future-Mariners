"use client";

import { FormEvent, useState } from "react";

const ContactForm = ({ name = "", email = "", phone = "" }: { name?: string; email?: string; phone?: string }) => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message") }) });
    if (response.ok) setSent(true); else { const data = await response.json(); setError(data.error ?? "Unable to send your message right now."); }
  };
  if (sent) return <div className="py-12 text-center"><h2 className="font-mulish text-3xl font-bold text-[#102c63]">Message sent</h2><p className="mt-4 leading-7 text-[#526176]">Thanks for reaching out. Our team will get back to you soon.</p></div>;
  return <form name="contact" onSubmit={handleSubmit} className="space-y-5"><label className="block text-sm font-bold text-[#273b58]">Name<input required name="name" defaultValue={name} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="Your name" /></label><label className="block text-sm font-bold text-[#273b58]">Email<input required type="email" name="email" defaultValue={email} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="you@example.com" /></label><label className="block text-sm font-bold text-[#273b58]">Phone number<input required type="tel" name="phone" inputMode="tel" defaultValue={phone} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="+91 9876543210" /></label><label className="block text-sm font-bold text-[#273b58]">Message<textarea required name="message" rows={5} className="mt-2 w-full border border-[#d8e0e8] px-4 py-3 outline-none focus:border-[#bd8014]" placeholder="How can we help?" /></label>{error && <p className="text-sm font-medium text-red-600">{error}</p>}<button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Send message <span className="ml-2">→</span></button></form>;
};

export default ContactForm;