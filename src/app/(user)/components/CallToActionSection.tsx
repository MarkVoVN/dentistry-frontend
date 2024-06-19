import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ArrowBigRight, ArrowRight } from "lucide-react";
import React from "react";

function CallToActionSection() {
  return (
    <div className="w-full flex flex-row justify-center bg-secondary">
      <section className="container py-16 ">
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/3 flex flex-row justify-center">
            <Button
              className={cn(
                "mr-10",
                "bg-accent-4 text-shade-1-100% hover:bg-accent-2 hover:text-shade-1-100%"
              )}
            >
              Register <ArrowRight></ArrowRight>
            </Button>
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
