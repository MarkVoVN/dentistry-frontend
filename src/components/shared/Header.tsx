"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useScrollDirection from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import jwt, { JwtPayload } from "jsonwebtoken";
import { LogOutIcon, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Typography } from "../typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { set } from "lodash";
import { useRouter } from "next/navigation";

function Header({
  variant = "default",
  isHome = false,
}: {
  variant?: "default" | "search";
  isHome?: boolean;
}) {
  const router = useRouter();
  const { scrollDirection, isScrollDownHero } = useScrollDirection();

  const [currentUser, setCurrentUser] = useState<any>({
    role: null,
    username: null,
    email: null,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken != null) {
      const decoded = jwt.decode(accessToken) as JwtPayload;

      setCurrentUser({
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        username:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
      });

      const exp = decoded["exp"];
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("logout");
    setCurrentUser({
      role: null,
      username: null,
      email: null,
    });
    router.push("/");
  };

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
        <NavigationMenuList className="gap-4 pt- pr-2 text-secondary">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Book Appointment</NavigationMenuTrigger>
            <NavigationMenuContent className="text-secondary hover:text-secondary">
              <ul className="grid gap-3 p-3 py-5 md:w-[300px]  ">
                <ListItem href="/clinics" title="Clinics">
                  View available clinics
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
          <NavigationMenuItem>
            {!currentUser.role && (
              <Link href="/login" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-accent-4 text-shade-1-100% hover:bg-accent-2 hover:text-shade-1-100%"
                  )}
                >
                  Login
                </NavigationMenuLink>
              </Link>
            )}
            {currentUser.role && currentUser.username && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex flex-row items-center gap-2 rounded hover:bg-secondary-100">
                    <div className="flex flex-col items-end gap-2">
                      <Typography
                        headingElement="h5"
                        headingStyle={"p"}
                        className="pl-4 py-2 text-sm font-medium text-secondary"
                      >
                        {currentUser.username}
                      </Typography>
                    </div>
                    <span className="h-8 w-8 rounded-full border-2 border-secondary-900">
                      <Image
                        width={112}
                        height={112}
                        src={"/Dentistry-logo.svg"}
                        alt="User"
                      />
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-4 ">
                  <div className="flex flex-col gap-2 items-center mb-2">
                    <Typography
                      headingElement="h5"
                      headingStyle={"h6"}
                      className="text-sm font-medium "
                    >
                      {currentUser.email}
                    </Typography>
                  </div>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="w-full flex flex-row gap-2 p-2 items-center justify-start text-sm rounded hover:bg-neutral-1 hover:cursor-pointer"
                  >
                    <User2Icon className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex flex-row gap-2 p-2 items-center justify-start text-sm rounded hover:bg-neutral-1 hover:cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
