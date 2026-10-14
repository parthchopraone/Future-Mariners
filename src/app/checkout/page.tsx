import Link from "next/link";
import CheckoutButton from "@/components/checkoutButton";

const CheckoutPage = async ({ searchParams }: { searchParams: Promise<{ course?: string }> }) => {
  const params = await searchParams;
  const courseName = params.course === "imucet-interview-preparation" ? "IMUCET Interview Preparation" : "Complete IMUCET Preparation";
  return <main className="min-h-[calc(100vh-80px)] bg-[#f3f6f8] py-16 sm:py-24"><div className="container max-w-2xl"><div className="bg-white p-8 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-12"><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Secure checkout</p><h1 className="mt-3 font-mulish text-4xl font-bold text-[#102c63]">Complete your enrolment.</h1><p className="mt-5 leading-7 text-[#526176]">Pay securely with Razorpay. Your course access will be activated after payment confirmation.</p><div className="mt-8 border-y border-[#e5eaf0] py-6 text-sm leading-7 text-[#526176]"><p>Selected course: <strong className="text-[#102c63]">{courseName}</strong></p><p className="mt-2">Status: Payment pending</p></div><div className="mt-8"><CheckoutButton courseSlug={params.course ?? "complete-imucet-preparation"} /></div><Link href="/dashboard" className="mt-6 inline-flex text-sm font-bold text-[#102c63]">Return to dashboard</Link></div></div></main>;
};

export default CheckoutPage;