"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

const HeaderVisibility = ({ children }: { children: ReactNode }) => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 8) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${
        hidden ? "max-xl:-translate-y-full" : "max-xl:translate-y-0"
      }`}
    >
      {children}
    </div>
  );
};

export default HeaderVisibility;
