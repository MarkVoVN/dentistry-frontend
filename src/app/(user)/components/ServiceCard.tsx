import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClinicModel } from "@/lib/api/clinicAPI";
import { formatPriceToVND } from "@/lib/utils";
import { HospitalIcon, MapPinIcon } from "lucide-react";

export default function ServiceCard({
  id,
  name,
  clinic,
  fee,
}: {
  id: number;
  name: string;
  clinic: ClinicModel;
  fee: number;
}) {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <ImageWithFallbackWithIcon
        alt="clinic logo"
        src={clinic.image ?? ""}
        width={100}
        height={100}
        fallbackIconComponent={
          <HospitalIcon width={100} height={100} className="p-4" />
        }
      ></ImageWithFallbackWithIcon>
      <div className="flex flex-col gap-2 flex-1">
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
          className="text-secondary-900 font-bold"
        >
          {`Price: ${formatPriceToVND(fee)}`}
        </Typography>
        <div className="flex flex-row gap-1">
          <MapPinIcon width={20} height={20} className=" text-neutral-7" />
          <div className="flex flex-col gap-2">
            <Typography
              headingElement="h5"
              headingStyle={"p"}
              className="text-neutral-7"
            >
              {`${clinic.name}`}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"secondary"}
          className="w-full text-shade-1-100% px-4 rounded-full"
        >
          Book Now
        </Button>
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"outline"}
          className="w-fit px-4 rounded-full"
        >
          View detail
        </Button>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <div className="w-[100px] h-[100px] flex items-center justify-center bg-neutral-2">
        <HospitalIcon width={100} height={100} className="p-4 text-neutral-5" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-1/3 bg-neutral-3 rounded" />
        <Skeleton className="h-6 w-1/4 bg-neutral-3 rounded" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full bg-neutral-3 rounded-full" />
        <Skeleton className="h-10 w-1/3 bg-neutral-3 rounded-full" />
      </div>
    </div>
  );
}

export function ServiceCardWithoutClinic({
  name,
  price,
  description,
  duration,
  handleOnClickBookNow,
}: {
  clinicID: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  serviceID: string;
  handleOnClickBookNow: () => void;
}) {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <div className="flex flex-col gap-2 flex-1">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name} (${duration} mins)`}
        </Typography>

        <Typography
          headingElement="h5"
          headingStyle={"p"}
          className="text-secondary-900 font-bold"
        >
          {`Price: ${formatPriceToVND(price)}`}
        </Typography>
        <Typography
          headingElement="h5"
          headingStyle={"p"}
          className="text-neutral-7"
        >
          {`${description}`}
        </Typography>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <Button
          onClick={() => {
            handleOnClickBookNow();
          }}
          variant={"secondary"}
          className="w-full text-shade-1-100% px-4 rounded-full"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export function ServiceCardSkeletonWithCLinic() {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-1/3 bg-neutral-3 rounded" />
        <Skeleton className="h-6 w-1/4 bg-neutral-3 rounded" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full bg-neutral-3 rounded-full" />
      </div>
    </div>
  );
}
