"use client";

import { Typography } from "@/components/ui/typography";
import {
  ClinicModel,
  ClinicQuery,
  getClinicById,
  queryClinic,
} from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { HospitalIcon } from "lucide-react";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { queryService, ServiceModel, ServiceQuery } from "@/lib/api/serviceAPI";
import ServiceCard, {
  ServiceCardSkeleton,
  ServiceCardWithoutClinic,
} from "../../components/ServiceCard";
import Image from "next/image";
import ServiecSelectSection from "./components/ServiceSelectSection";
import DentistSelectSection from "./components/DentistSelectSection";
import AppointmentInfoSection from "../../appointments/book/components/AppointmentInfoSection";

export type AppointmentSelectionQuery = {
  clinicId: string;
  serviceId?: string;
  dentistId?: string;
};

export default function SearchPage({ params: { clinicId } }: any) {
  const urlParams = useSearchParams();

  let decodedUrlParams: any = {};
  Array.from(urlParams.entries()).forEach((pair) => {
    try {
      decodedUrlParams[pair[0]] = JSON.parse(pair[1]);
    } catch (error) {
      return;
    }
  });

  // const query: ServiceQuery = {
  //   ClinicID: clinicId,
  //   SearchTerm: "",
  //   PageNumber: 1,
  //   PageSize: 5,
  //   ...decodedUrlParams,
  // };

  // const [appointmentSelectionQuery, setAppointmentSelectionQuery] =
  //   useState<AppointmentSelectionQuery>({
  //     clinicId: clinicId,
  //   });

  const appointmentSelectionQuery: AppointmentSelectionQuery = {
    clinicId: clinicId,
    serviceId: decodedUrlParams["serviceId"],
    dentistId: decodedUrlParams["dentistId"],
  };

  const { serviceId, dentistId } = appointmentSelectionQuery;

  const [clinic, setClinic] = useState<ClinicModel>();

  const {
    data: clinic_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinicDetail", clinicId],
    queryFn: () => getClinicById(clinicId),
  });

  useEffect(() => {
    if (isSuccess && clinic_data) {
      const { data, pagination: req_pagination } = clinic_data;
      setClinic(data);
    }
  }, [isSuccess, clinic_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  return (
    <main className="flex flex-col items-center">
      <div className="w-full flex flex-row justify-center ">
        <section className="container">
          <Image
            src={"/dentistry-banner.png"}
            alt="dentistry banner"
            width={100}
            height={100}
            className="w-full h-full"
            objectFit="cover"
          ></Image>
        </section>
      </div>
      <div className="w-full flex flex-row justify-center bg-primary-100 py-12">
        <section className="container flex flex-row justify-center">
          <AppointmentInfoSection defaultClinicId={clinicId} />
          {clinicId && !serviceId && (
            <ServiecSelectSection
              appointmentSelectionQuery={appointmentSelectionQuery}
            />
          )}
          {clinicId && !dentistId && serviceId && (
            <DentistSelectSection
              appointmentSelectionQuery={appointmentSelectionQuery}
            />
          )}
        </section>
      </div>
    </main>
  );
}
