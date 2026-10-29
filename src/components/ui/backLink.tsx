import { ArrowLeft } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const BackLink = ({ href, children, className }: BackLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d8e0e8] bg-white px-4 py-2 text-sm font-bold text-[#526176] shadow-xs transition-all hover:border-[#7D52F4] hover:text-[#102c63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D52F4] focus-visible:ring-offset-2",
        className,
      )}
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
};

export default BackLink;
