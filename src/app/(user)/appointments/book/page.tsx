"use client";

import ScheduleSelectSection from "./components/ScheduleSelectSection";
import AppointmentInfoSection from "./components/AppointmentInfoSection";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BookAppointmentPage() {
  const router = useRouter();

  const [isAuthenticatedAsCustomer, setIsAuthenticatedAsCustomer] =
    useState<boolean>();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const exp = decoded["exp"];

      if (role !== "Customer") setIsAuthenticatedAsCustomer(false);
      else setIsAuthenticatedAsCustomer(true);
    } catch (err) {
      router.push("/login");
    }
  }, []);

  return (
    <main className="flex flex-col items-center">
      <div className="w-full flex flex-row justify-center bg-primary-100 py-12">
        <section className="container flex flex-row justify-center">
          {isAuthenticatedAsCustomer === undefined && (
            <div className="flex flex-col gap-6">
              <Typography
                headingElement="h2"
                headingStyle={"h4"}
                className="text-secondary-900 font-bold"
              >
                Authenticating please wait...
              </Typography>
            </div>
          )}
          {isAuthenticatedAsCustomer === true && (
            <React.Fragment>
              <AppointmentInfoSection />
              <ScheduleSelectSection />
            </React.Fragment>
          )}
          {isAuthenticatedAsCustomer === false && (
            <div className="flex flex-col justify-center gap-6 h-[calc(100vh-350px-64px)] ">
              <div className="flex flex-col gap-6  p-10">
                <Image
                  src={"/401.svg"}
                  alt={"dentistry logo"}
                  width={300}
                  height={300}
                />
                <Typography
                  headingElement="h2"
                  headingStyle={"h4"}
                  className="text-secondary-900 font-bold"
                >
                  You are currently not logged in.
                </Typography>
                <Button
                  className=""
                  variant={"outline"}
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
