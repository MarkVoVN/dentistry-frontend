"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function CallToActionSection() {
  const router = useRouter();
  const [isAuthhenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      setIsAuthenticated(true);
    } catch (err) {
      
    }
  }, []);
  return (
    <div className="w-full flex flex-row justify-center bg-secondary">
      <section className="container py-16 ">
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/3 flex flex-row justify-center">
            {!isAuthhenticated ? (
              <Button
                className={cn(
                  "mr-10",
                  "bg-accent-4 text-shade-1-100% hover:bg-accent-2 hover:text-shade-1-100%"
                )}
                onClick={() => router.push("/register")}
              >
                Register <ArrowRight></ArrowRight>
              </Button>
            ) : (
              <></>
            )}
          </div>
          <Typography
            headingElement="p"
            headingStyle={"body"}
            className="w-2/5 text-shade-1-100% font-medium"
          >
            DENTISTRY provides online medical appointments and health care
            scheduling services at leading clinics in Vietnam such as I-Dent
            Dental System, Viet Smile Dental Clinic and Worldwide Dental
            Hospital, helping users make their own choices. Choose services and
            dentists according to your needs.
          </Typography>
        </div>
      </section>
    </div>
  );
}

export default CallToActionSection;
