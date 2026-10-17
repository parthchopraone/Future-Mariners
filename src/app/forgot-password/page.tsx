"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Unable to start password reset."); return; }
    setMessage("If an account exists for that email, a password reset link has been sent.");
    if (data.resetUrl) setResetUrl(data.resetUrl);
  };

  return <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-16 sm:py-24"><div className="container max-w-xl"><div className="bg-white p-8 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-12"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Account recovery</p><h1 className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">Forgot your password?</h1><p className="mt-4 leading-7 text-[#526176]">Enter the email address connected to your student account and we will send a secure reset link.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-[#273b58]">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="you@example.com" /></label>{error && <p className="text-sm font-medium text-red-600">{error}</p>}{message && <p className="text-sm leading-6 text-[#27734c]">{message}</p>}{resetUrl && <Link href={resetUrl} className="block break-all text-sm font-bold text-[#102c63]">Open local reset link</Link>}<button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Send reset link</button></form><p className="mt-6 text-center text-sm text-[#718096]"><Link href="/login" className="font-bold text-[#102c63]">Back to sign in</Link></p></div></div></main>;
};

export default ForgotPasswordPage;