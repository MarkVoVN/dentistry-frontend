"use client";
import { useEffect, useState } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("up");
  const [isScrollDownHero, setIsScrollDownHero] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      console.log("lastScrollY", window.pageYOffset);
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)
      ) {
        if (scrollY > 100) {
          setScrollDirection(direction);
        }
      }
      if (scrollY > 380) {
        setIsScrollDownHero(true);
      } else {
        setIsScrollDownHero(false);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  return { scrollDirection, isScrollDownHero };
}
