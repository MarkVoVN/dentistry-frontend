"use client";

import { Typography } from "@/components/ui/typography";
import { ClinicModel, getClinicById } from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { HospitalIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { getServiceById, ServiceModel } from "@/lib/api/serviceAPI";
import { DentistModel, getDentistById } from "@/lib/api/dentistAPI";
import { formatPriceToVND } from "@/lib/utils";
import ScheduleSelectSection from "./components/ScheduleSelectSection";

export default function BookAppointmentPage() {
  const urlParams = useSearchParams();

  let decodedUrlParams: any = {};
  Array.from(urlParams.entries()).forEach((pair) => {
    try {
      decodedUrlParams[pair[0]] = JSON.parse(pair[1]);
    } catch (error) {
      return;
    }
  });

  const { clinicId, serviceId, dentistId } = {
    clinicId: decodedUrlParams["clinicId"],
    serviceId: decodedUrlParams["serviceId"],
    dentistId: decodedUrlParams["dentistId"],
  };

  const [clinic, setClinic] = useState<ClinicModel>();
  const [service, setService] = useState<ServiceModel>();
  const [dentist, setDentist] = useState<DentistModel>();

  const {
    data: clinic_data,
    isLoading: clinic_isLoading,
    error: clinic_error,
    isError: clinic_isError,
    isSuccess: clinic_isSuccess,
  } = useQuery({
    queryKey: ["clinicDetail", clinicId],
    queryFn: () => getClinicById(clinicId),
  });

  useEffect(() => {
    if (clinic_isSuccess && clinic_data) {
      const { data, pagination: req_pagination } = clinic_data;
      setClinic(data);
    }
  }, [clinic_isSuccess, clinic_data]);

  useErrorNotification({
    isError: clinic_isError,
    title: clinic_error?.message,
  });

  const {
    data: service_data,
    isLoading: service_isLoading,
    error: service_error,
    isError: service_isError,
    isSuccess: service_isSuccess,
  } = useQuery({
    queryKey: ["serviceDetail", serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  useEffect(() => {
    if (service_isSuccess && service_data) {
      const { data, pagination: req_pagination } = service_data;
      setService(data);
    }
  }, [service_isSuccess, service_data]);

  useErrorNotification({
    isError: service_isError,
    title: service_error?.message,
  });

  const {
    data: dentist_data,
    isLoading: dentist_isLoading,
    error: dentist_error,
    isError: dentist_isError,
    isSuccess: dentist_isSuccess,
  } = useQuery({
    queryKey: ["dentistDetail", dentistId],
    queryFn: () => getDentistById(dentistId),
  });

  useEffect(() => {
    if (dentist_isSuccess && dentist_data) {
      const { data, pagination: req_pagination } = dentist_data;
      setDentist(data);
    }
  }, [dentist_isSuccess, dentist_data]);

  useErrorNotification({
    isError: service_isError,
    title: service_error?.message,
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
          <section className="w-1/3 flex flex-col gap-6 px-6 ">
            <div className="flex flex-col bg-shade-1-100% rounded-xl">
              <div className="flex flex-row justify-between p-6 pb-2">
                <Typography headingElement="h2" headingStyle={"h4"}>
                  Clinic
                </Typography>
              </div>
              <div className="flex flex-row gap-4 py-4 px-8">
                {clinic_isLoading ? (
                  <HospitalIcon width={100} height={100} className="p-4" />
                ) : (
                  <ImageWithFallbackWithIcon
                    alt="clinic logo"
                    src={clinic?.image ?? ""}
                    width={100}
                    height={100}
                    fallbackIconComponent={
                      <HospitalIcon width={100} height={100} className="p-4" />
                    }
                  ></ImageWithFallbackWithIcon>
                )}
                <div className="flex flex-col gap-2">
                  <Typography
                    headingElement="h5"
                    headingStyle={"h6"}
                    className="text-secondary-900 font-bold"
                  >
                    {clinic?.name}
                  </Typography>
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7"
                  >
                    {clinic?.address}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-shade-1-100% rounded-xl">
              <div className="flex flex-row justify-between p-6 pb-2">
                <Typography headingElement="h2" headingStyle={"h4"}>
                  Service
                </Typography>
              </div>
              <div className="flex flex-row gap-4 py-4 px-8">
                <div className="flex flex-col gap-2">
                  <Typography
                    headingElement="h5"
                    headingStyle={"h6"}
                    className="text-secondary-900 font-bold"
                  >
                    {service?.name}
                  </Typography>
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7"
                  >
                    {service?.description}
                  </Typography>
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7"
                  >
                    {formatPriceToVND(service?.price ?? 0)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-shade-1-100% rounded-xl">
              <div className="flex flex-row justify-between p-6 pb-2">
                <Typography headingElement="h2" headingStyle={"h4"}>
                  Dentist
                </Typography>
              </div>
              <div className="flex flex-col gap-4 py-4 px-8">
                {dentist_isLoading ? (
                  <UserIcon width={100} height={100} className="p-4" />
                ) : (
                  <ImageWithFallbackWithIcon
                    alt="dentist profile"
                    src={dentist?.image ?? ""}
                    width={100}
                    height={100}
                    fallbackIconComponent={
                      <UserIcon width={100} height={100} className="p-4" />
                    }
                  ></ImageWithFallbackWithIcon>
                )}
                <div className="flex flex-col gap-2">
                  <Typography
                    headingElement="h5"
                    headingStyle={"h6"}
                    className="text-secondary-900 font-bold"
                  >
                    {dentist?.name}
                  </Typography>
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7"
                  >
                    {`Specialization: ${dentist?.specialization}`}
                  </Typography>
                </div>
              </div>
            </div>
          </section>
          <ScheduleSelectSection />
        </section>
      </div>
    </main>
  );
}
