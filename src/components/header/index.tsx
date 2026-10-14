import Image from "next/image";
import Link from "next/link";
import Navigation from "./navigation";
import MobileNavigation from "./mobileNavigation";
import HeaderExtraInfo from "./headerExtraInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type MenuType = {
  id: number;
  label: string;
  href: string;
  subMenu?: {
    id: number;
    label: string;
    href: string;
  }[];
};
const menuList: MenuType[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Courses",
    href: "/#courses",
  },
  { id: 3, label: "Why Future Mariners", href: "/#why-us" },
  { id: 4, label: "FAQ", href: "/#faq" },
  { id: 5, label: "Contact", href: "/contact" },
];

const Header = async () => {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user?.id);
  const navigation = isAuthenticated ? [] : menuList;

  return (
    <header className="sticky top-0 left-0 z-50 w-full overflow-x-clip bg-primary py-4">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href={"/"} className="flex shrink-0 items-center gap-3 py-1">
              <Image src="/images/logo.jpg" width={48} height={48} alt="Future Mariners Foundation" className="size-12 rounded-full object-cover" />
              <span className="hidden font-mulish text-sm leading-4 font-bold tracking-[0.08em] text-[#102c63] sm:block">FUTURE<br />MARINERS</span>
            </Link>
            <Navigation data={navigation} />
          </div>
          <div className="flex items-center gap-7">
            <HeaderExtraInfo isAuthenticated={isAuthenticated} />
            <MobileNavigation data={navigation} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
