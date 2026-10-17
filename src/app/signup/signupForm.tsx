"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isValidPhone } from "@/lib/phone";

const SignupForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void (async () => {
      const formData = new FormData(event.currentTarget);
      if (!isValidPhone(String(formData.get("phone") ?? ""))) { setError("Enter a valid phone number using digits only."); return; }
      const response = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone"), password: formData.get("password"), courseSlug: formData.get("course") }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error ?? "Unable to create your account."); return; }
      const login = await signIn("credentials", { identifier: formData.get("email"), password: formData.get("password"), redirect: false });
      if (login?.error) { setError("Account created. Please sign in to continue."); return; }
      router.push(data.next);
    })();
  };

  return <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-12 sm:py-20"><div className="container grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div className="hidden bg-[#102c63] p-10 text-white lg:block"><Image src="/images/logo.jpg" width={768} height={1152} alt="Future Mariners Foundation" className="mx-auto w-40" /><p className="mt-8 text-sm font-bold tracking-[0.2em] text-[#e4aa3b] uppercase">Your first watch starts here</p><h1 className="mt-4 font-mulish text-4xl leading-tight font-bold">Set your course for IMUCET 2027.</h1><p className="mt-5 leading-7 text-[#d9e1ec]">Create your student profile today. Course selection, payments, and WhatsApp group access will be connected to this account next.</p></div><div className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-10"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Student registration</p><h2 className="mt-3 font-mulish text-3xl font-bold text-[#102c63] sm:text-4xl">Create your Future Mariners account.</h2><p className="mt-4 leading-7 text-[#526176]">Use the email and phone number you want connected to your course access and support.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-[#273b58]">Full name<input required name="name" type="text" placeholder="Your full name" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label><label className="block text-sm font-bold text-[#273b58]">Email address<input required name="email" type="email" placeholder="you@example.com" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-bold text-[#273b58]">Phone number<input required name="phone" type="tel" inputMode="tel" pattern="[+]?[0-9 ()-]{7,20}" placeholder="+91 9876543210" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label><label className="block text-sm font-bold text-[#273b58]">Choose a course<select required name="course" defaultValue="" className="mt-2 h-12 w-full border border-[#d8e0e8] bg-white px-4 outline-none focus:border-[#bd8014]"><option value="" disabled>Select course</option><option value="complete-imucet-preparation">Complete IMUCET + Sponsorship Preparation - ₹4,999</option><option value="imucet-interview-preparation">Complete Sponsorship Preparation - ₹2,499</option></select></label></div><label className="block text-sm font-bold text-[#273b58]">Password<input required minLength={8} name="password" type="password" placeholder="At least 8 characters" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label><label className="flex gap-3 text-sm leading-6 text-[#526176]"><input required type="checkbox" className="mt-1 accent-[#102c63]" />I agree to receive course and support updates from Future Mariners.</label>{error && <p className="text-sm font-medium text-red-600">{error}</p>}<button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Create student account <span className="ml-2">→</span></button></form><p className="mt-6 text-center text-sm text-[#718096]">Already registered? <Link href="/login" className="font-bold text-[#102c63]">Sign in</Link></p></div></div></main>;
};

export default SignupForm;