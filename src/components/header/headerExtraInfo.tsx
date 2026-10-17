"use client";
import Button from "../ui/button";
import Link from "next/link";
import ButtonArrow from "../ui/buttonArrow";
import { signOut } from "next-auth/react";

const HeaderExtraInfo = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (isAuthenticated) {
    return <div className="flex items-center gap-x-4"><Button asChild className="hidden h-12 justify-between gap-2.5 py-1.5 pr-1.5 pl-6 text-base tracking-base lg:flex"><Link href="/account">My account <ButtonArrow /></Link></Button><button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="hidden text-sm font-bold text-[#526176] transition hover:text-[#7d52f4] lg:block">Log out</button></div>;
  }

  return (
    <div className="flex items-center gap-x-4">
      <Button
        asChild
        className="hidden h-12 justify-between gap-2.5 py-1.5 pr-1.5 pl-6 text-base tracking-base lg:flex"
      >
        <Link href={"/login"}>
          Student sign in
          <ButtonArrow />
        </Link>
      </Button>
    </div>
  );
};

export default HeaderExtraInfo;
