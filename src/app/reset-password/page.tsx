"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password !== confirmation) { setError("Passwords do not match."); return; }
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: params.get("email"), token: params.get("token"), password }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Unable to reset your password."); return; }
    setMessage("Your password has been reset. You can now sign in.");
  };
  return <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-16 sm:py-24"><div className="container max-w-xl"><div className="bg-white p-8 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-12"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Account recovery</p><h1 className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">Set a new password.</h1>{message ? <div className="mt-6"><p className="text-[#27734c]">{message}</p><Link href="/login" className="mt-6 inline-flex font-bold text-[#102c63]">Go to sign in →</Link></div> : <form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-[#273b58]">New password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="At least 8 characters" /></label><label className="block text-sm font-bold text-[#273b58]">Confirm password<input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" placeholder="Repeat your password" /></label>{error && <p className="text-sm font-medium text-red-600">{error}</p>}<button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Reset password</button></form>}</div></div></main>;
};

export default ResetPasswordPage;