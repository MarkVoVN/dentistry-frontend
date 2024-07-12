import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { HospitalIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ClinicCard({
  id,
  name,
  address,
  description,
  logo,
  isLoading = false,
  onClickBookNow,
}: {
  id: number;
  name: string;
  address: string;
  description: string;
  logo?: string;
  isLoading?: boolean;
  onClickBookNow: () => void;
}) {
  return (
    <div className="flex flex-row gap-4 hover:bg-neutral-2 py-4 px-8">
      {isLoading ? (
        <Skeleton className="w-24 h-24 rounded-full flex items-center justify-center">
          <HospitalIcon width={100} height={100} className="p-4" />
        </Skeleton>
      ) : (
        <ImageWithFallbackWithIcon
          alt="clinic logo"
          src={logo ?? ""}
          width={100}
          height={100}
          fallbackIconComponent={
            <HospitalIcon width={100} height={100} className="p-4" />
          }
        ></ImageWithFallbackWithIcon>
      )}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <React.Fragment>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-24" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography
              headingElement="h5"
              headingStyle={"h6"}
              className="text-secondary-900 font-bold"
            >
              {`${name}`}
            </Typography>
            <Typography
              headingElement="h5"
              headingStyle={"p"}
              className="text-neutral-7"
            >
              {address}
            </Typography>
          </React.Fragment>
        )}
        <Button
          onClick={() => {
            onClickBookNow();
          }}
          variant={"secondary"}
          className="w-fit text-shade-1-100% px-4 rounded-full"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export function ClinicCardSkeleton() {
  return (
    <div className="flex flex-row gap-4 hover:bg-neutral-2 py-4 px-8">
      <div className="flex-shrink-0">
        <Skeleton className="w-24 h-24 rounded-full flex items-center justify-center">
          <HospitalIcon width={100} height={100} className="p-4" />
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
