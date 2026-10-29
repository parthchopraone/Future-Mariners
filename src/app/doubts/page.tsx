import BackLink from "@/components/ui/backLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DoubtForm from "./doubtForm";

const DoubtsPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, phone: true } }) : null;
  return <main className="bg-[#f3f6f8] py-16 sm:py-24"><div className="container grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="text-sm font-bold tracking-[0.2em] text-[#bd8014] uppercase">Student support</p><h1 className="mt-4 font-mulish text-5xl leading-tight font-bold text-[#102c63]">Send your doubt.</h1><p className="mt-6 max-w-md text-lg leading-8 text-[#526176]">Tell us where you are stuck and our academic team will help you find your next step.</p><BackLink href="/dashboard" className="mt-8">Back to dashboard</BackLink></div><div className="bg-white p-7 shadow-[0_18px_50px_rgba(16,44,99,0.09)] sm:p-10"><DoubtForm name={user?.name ?? session?.user?.name ?? ""} email={user?.email ?? session?.user?.email ?? ""} phone={user?.phone ?? ""} authenticated={Boolean(session?.user?.id)} /></div></div></main>;
};

export default DoubtsPage;