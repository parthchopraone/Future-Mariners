"use client";
import { MouseEvent, useEffect, useState } from "react";
import { MenuType } from ".";
import Link from "next/link";
import {
  ArrowLeft,
  CloseIcon,
  MenuIcon,
  PlusIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LoadingLink from "../ui/loadingLink";

const MobileNavigation = ({ data, isAuthenticated }: { data: MenuType[]; isAuthenticated: boolean }) => {
  const pathName = usePathname();
  const [navbarShow, setNavbarShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<null | number>(null);
  const [selectLabel, setSelectLabel] = useState("");

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    if (navbarShow) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [navbarShow]);

  const closeNavigation = () => {
    setNavbarShow(false);
    setDropdownOpen(null);
    setSelectLabel("");
  };

  const handleDropdownLinkClick = (
    e: MouseEvent,
    id: number,
    label: string,
    subMenu: MenuType["subMenu"],
  ) => {
    if (subMenu?.length) {
      e.preventDefault();
    }
    setDropdownOpen(id);
    setSelectLabel(label);
  };

  const handleBackClick = () => {
    setDropdownOpen(null);
    setSelectLabel("");
  };

  const handleLogout = () => {
    closeNavigation();
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative z-50 block xl:hidden">
      <button onClick={() => setNavbarShow(true)} className="cursor-pointer">
        <MenuIcon />
      </button>
      {/* navigation overlay */}
      <div
        onClick={closeNavigation}
        className={cn(
          "fixed inset-0 z-50 touch-none bg-gray-700/90 transition-all duration-300",
          navbarShow ? "visible opacity-100" : "invisible opacity-0",
        )}
      ></div>
      <nav
        className={cn(
          "fixed inset-y-0 right-0 z-999 flex h-screen w-full max-w-85 touch-none flex-col overflow-hidden bg-primary px-3 pt-7 pb-3 shadow-lg transition-transform duration-500",
          navbarShow ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* navigation close button */}
        <button
          onClick={closeNavigation}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center transition-all duration-500 hover:text-red-600"
        >
          <CloseIcon />
        </button>
        {/* menu items */}
        <ul className={cn("mt-5 flex flex-1 flex-col", isAuthenticated && "hidden")}>
          {data.map(({ href, id, label, subMenu }) => {
            // Check if current path matches parent or any submenu item
            const isActive =
              pathName === href ||
              subMenu?.some((item) => pathName === item.href);

            return (
              <li key={id}>
                <Link
                  href={href}
                  onClick={(e) => {
                    handleDropdownLinkClick(e, id, label, subMenu);
                    if (!subMenu?.length) closeNavigation();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-5 py-2 leading-6 font-medium tracking-base transition-all duration-500 hover:text-purple-500",
                    isActive ? "text-purple-500" : "text-secondary",
                  )}
                >
                  {label}
                  {subMenu?.length && (
                    <span>
                      <PlusIcon />
                    </span>
                  )}
                </Link>

                {subMenu?.length && (
                  <ul
                    className={cn(
                      "absolute top-0 w-full space-y-1 bg-primary py-3 transition-all duration-300",
                      dropdownOpen === id ? "left-0" : "-left-full",
                    )}
                  >
                    <li className="flex items-center border-b border-b-gray-200 px-5 pb-2 font-medium">
                      <span
                        onClick={handleBackClick}
                        className="flex h-7 w-7 cursor-pointer items-center"
                      >
                        <ArrowLeft className="size-5" />
                      </span>
                      {selectLabel}
                    </li>
                    {subMenu.map(({ href, id, label }) => (
                      <li key={id}>
                        <Link
                          href={href}
                          onClick={closeNavigation}
                          className={cn(
                            "flex rounded-xl px-5 py-2 text-sm leading-6 font-medium tracking-base transition-all duration-500 hover:bg-gray-50 hover:text-purple-500",
                            pathName === href
                              ? "bg-gray-50 text-purple-500"
                              : "text-secondary",
                          )}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className={cn(isAuthenticated ? "mt-5" : "mt-auto")}>
          <LoadingLink
            key={pathName}
            href={isAuthenticated ? "/dashboard" : "/login"}
            onClick={closeNavigation}
            loadingText="Loading..."
            className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#7D52F4] px-5 py-3 text-base font-medium tracking-base text-primary transition-colors hover:bg-purple-600 lg:hidden"
          >
            {isAuthenticated ? "Dashboard" : "Login/ Sign up"}
          </LoadingLink>
          {isAuthenticated && (
            <button type="button" onClick={handleLogout} className="mt-3 w-full px-5 py-3 text-center text-sm font-bold text-[#526176] transition hover:text-[#7d52f4]">Log out</button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
