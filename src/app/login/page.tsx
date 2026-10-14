"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { identifier: data.get("identifier"), password: data.get("password"), redirect: false });
    if (result?.error) setError("Email or password is incorrect."); else {
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      router.push(callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard");
      router.refresh();
    }
  };

  return (
  <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-16 sm:py-24">
    <div className="container max-w-xl">
      <div className="bg-white p-8 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-12">
        <p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Student access</p>
        <h1 className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">Welcome back.</h1>
        <p className="mt-4 leading-7 text-[#526176]">Sign in with the email address or phone number connected to your student account.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-[#273b58]">Email or phone number<input required name="identifier" type="text" placeholder="you@example.com or +91..." className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label><label className="block text-sm font-bold text-[#273b58]">Password<input required name="password" type="password" placeholder="Your password" className="mt-2 h-12 w-full border border-[#d8e0e8] px-4 outline-none focus:border-[#bd8014]" /></label>{error && <p className="text-sm font-medium text-red-600">{error}</p>}<button type="submit" className="w-full rounded-full bg-[#7D52F4] px-6 py-4 font-bold text-white transition hover:bg-purple-600">Sign in</button></form>
        <p className="mt-6 text-center text-sm text-[#718096]">New student? <Link href="/signup" className="font-bold text-[#102c63]">Create an account</Link></p>
      </div>
    </div>
  </main>
  );
};

export default LoginPage;