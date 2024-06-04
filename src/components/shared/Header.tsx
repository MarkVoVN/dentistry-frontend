"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import useScrollDirection from "@/hooks/useScrollDirection";
import Image from "next/image";
import { cn } from "@/lib/utils";

function Header({
  variant = "default",
  isHome = false,
}: {
  variant?: "default" | "search";
  isHome?: boolean;
}) {
  const { scrollDirection, isScrollDownHero } = useScrollDirection();
  return (
    <header
      className={`main-header ${
        isHome
          ? !isScrollDownHero
            ? "relative border-b-0 lg:border-b-[1px] "
            : "sticky"
          : "sticky"
      } ${
        scrollDirection === "down" ? "-top-16" : "top-0"
      }  h-16 w-full flex flex-row justify-between items-center px-[calc((100vw-1200px)/2)]  z-50 sm:border-b-[1px] border-b-neutral-3 transition-all duration-500 bg-shade-1-100%`}
    >
      <Link href="/" className="px-6">
        <Image
          src="/dentistry.svg"
          alt="laptoptot.vn"
          width={180}
          height={50}
        />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="gap-4 pt-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Book Appointment</NavigationMenuTrigger>
            <NavigationMenuContent className="">
              <ul className="grid gap-3 p-3 py-5 md:w-[300px]  ">
                <ListItem href="/clinic" title="Clinics">
                  View available clinics
                </ListItem>
                <ListItem href="/dentist" title="Dentists">
                  View available dentists
                </ListItem>
                <ListItem href="/service" title="Services">
                  View availalbe services
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-3 py-5 md:w-[300px]  ">
                <ListItem href="/introduction" title="Who we are"></ListItem>
                <ListItem
                  href="/terms-and-condition"
                  title="Terms & Condition"
                ></ListItem>
                <ListItem
                  href="/privary-policy"
                  title="Privacy Policy"
                ></ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Guide</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-3 py-5 md:w-[300px]  ">
                <ListItem
                  href="/how-to-make-an-appointment"
                  title="How to make an appointment"
                ></ListItem>
                <ListItem href="/faq" title="FAQ"></ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          <NavigationMenuItem>
            <Link href="/register" passHref legacyBehavior>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-accent-4 text-shade-1-100% hover:bg-accent-2 hover:text-shade-1-100%"
                )}
              >
                Register
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default Header;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
