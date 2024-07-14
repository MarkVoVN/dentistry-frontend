import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClinicModel } from "@/lib/api/clinicAPI";
import { DentistModel } from "@/lib/api/dentistAPI";
import { MapPinIcon, SquareUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSignalRChat from "../chat/chatService";

export default function DentistCard({
  id,
  dentist,
  name,
  clinic,
  image,
  handleBookNow,
}: {
  id: number;
  dentist: DentistModel;
  name: string;
  clinic: ClinicModel;
  image?: string;
  handleBookNow: () => void;
}) {
  const router = useRouter();
  const { setDentist, setReceiverId } = useSignalRChat();
  const handleMessage = () => {
    localStorage.setItem("receiverId", dentist.id!);
    router.push("/chat");
  };
  return (
    <div className="flex flex-col gap-4 min-w-[260px] border-2 border-neutral-3 hover:border-secondary-500 rounded-xl">
      <div className="flex flex-col items-center justify-center">
        <ImageWithFallbackWithIcon
          alt="clinic logo"
          src={image ?? ""}
          width={200}
          height={200}
          fallbackIconComponent={
            <SquareUserIcon width={200} height={200} className="p-4" />
          }
        ></ImageWithFallbackWithIcon>
      </div>
      <div className="flex flex-col gap-4 flex-1 bg-secondary-100 rounded-xl py-4 px-4">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name}`}
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
            <Typography
              headingElement="h5"
              headingStyle={"p"}
              className="text-neutral-7"
            >
              {clinic.address}
            </Typography>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => {
              handleBookNow();
            }}
            variant={"outline"}
            className="w-full text-secondary px-4 rounded-full"
          >
            Book Now
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              handleMessage();
            }}
            className="w-full text-secondary px-4 rounded-full"
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DentistCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 min-w-[260px] border-2 border-neutral-3 rounded-xl">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[200px] h-[200px] flex items-center justify-center bg-neutral-2">
          <SquareUserIcon
            width={200}
            height={200}
            className="p-4 text-neutral-5"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1 bg-secondary-100 rounded-xl py-4 px-4">
        <Skeleton className="h-6 w-1/3 bg-neutral-3 rounded" />
        <div className="flex flex-row gap-1 items-center">
          <MapPinIcon width={20} height={20} className="text-neutral-7" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-1/2 bg-neutral-3 rounded" />
            <Skeleton className="h-6 w-3/4 bg-neutral-3 rounded" />
          </div>
        </div>
        <Skeleton className="h-10 w-full bg-neutral-3 rounded-full" />
      </div>
    </div>
  );
}

export function DentistCardWithoutClinic({
  name,
  image,
  specialization,
  handleOnClickBookNow,
}: {
  name: string;
  image?: string;
  specialization: string;
  handleOnClickBookNow: () => void;
}) {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <ImageWithFallbackWithIcon
        alt="clinic logo"
        src={image ?? ""}
        width={100}
        height={100}
        fallbackIconComponent={
          <SquareUserIcon width={100} height={100} className="p-4" />
        }
      ></ImageWithFallbackWithIcon>
      <div className="flex flex-col gap-2 flex-1">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name} `}
        </Typography>

        <Typography
          headingElement="h5"
          headingStyle={"p"}
          className="text-neutral-7"
        >
          {`${specialization}`}
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

export function DentistCardSkeletonWithoutClinic() {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <div className="w-[100px] h-[100px] flex items-center justify-center bg-neutral-2">
        <SquareUserIcon
          width={100}
          height={100}
          className="p-4 text-neutral-5"
        />
      </div>
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
