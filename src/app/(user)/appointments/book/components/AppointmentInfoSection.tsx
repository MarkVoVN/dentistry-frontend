"use client";

import { Typography } from "@/components/ui/typography";
import { ClinicModel, getClinicById } from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import {
  BriefcaseBusinessIcon,
  DollarSignIcon,
  HandCoinsIcon,
  HospitalIcon,
  MapPin,
  MapPinIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";

import { getServiceById, ServiceModel } from "@/lib/api/serviceAPI";
import { DentistModel, getDentistById } from "@/lib/api/dentistAPI";
import { formatPriceToVND } from "@/lib/utils";

export default function AppointmentInfoSection({
  defaultClinicId,
}: {
  defaultClinicId?: string;
}) {
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
    clinicId: defaultClinicId ?? decodedUrlParams["clinicId"],
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

  // useErrorNotification({
  //   isError: service_isError,
  //   title: service_error?.message,
  // });

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

  // useErrorNotification({
  //   isError: service_isError,
  //   title: service_error?.message,
  // });

  return (
    <section className="w-1/3 flex flex-col gap-6 px-6 ">
      <div className="flex flex-col bg-shade-1-100% rounded-xl">
        <div className="flex flex-row justify-between px-4 py-2 bg-secondary-600 text-shade-1-100%  rounded-t-xl">
          <Typography headingElement="h2" headingStyle={"h6"}>
            Appointment Info
          </Typography>
        </div>
        <div className="flex flex-row gap-4 py-2 px-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <HospitalIcon className="w-4 h-4 mr-2" />
              <Typography
                headingElement="h5"
                headingStyle={"p"}
                className="text-neutral-7"
              >
                {clinic?.name}
              </Typography>
            </div>
            <div className="flex flex-row gap-2 ">
              <MapPin className="w-5 h-6 mr-2" />
              <Typography
                headingElement="h5"
                headingStyle={"p"}
                className="text-neutral-7 text-wrap"
              >
                {clinic?.address}
              </Typography>
            </div>
            {service && (
              <React.Fragment>
                <div className="flex flex-row gap-2 items-center">
                  <HandCoinsIcon className="w-4 h-4 mr-2" />
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7 text-wrap"
                  >
                    {service?.name}
                  </Typography>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <DollarSignIcon className="w-4 h-4 mr-2" />
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7 text-wrap"
                  >
                    {formatPriceToVND(service?.price ?? 0)}
                  </Typography>
                </div>
              </React.Fragment>
            )}
            {dentist && (
              <React.Fragment>
                <div className="flex flex-row gap-2 items-center">
                  <StethoscopeIcon className="w-4 h-4 mr-2" />
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7 text-wrap"
                  >
                    {dentist?.name}
                  </Typography>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <BriefcaseBusinessIcon className="w-4 h-4 mr-2" />
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7 text-wrap"
                  >
                    {`Specialization: ${dentist?.specialization}`}
                  </Typography>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
