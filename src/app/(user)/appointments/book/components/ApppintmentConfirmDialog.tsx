"use client";

import { Typography } from "@/components/ui/typography";
import { ClinicModel, getClinicById } from "@/lib/api/clinicAPI";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ImageWithFallbackWithIcon } from "@/components/ImageWithFallback";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import {
  BriefcaseBusinessIcon,
  CalendarDays,
  Clock,
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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { createAppointment } from "@/lib/api/appointmentAPI";
import toast from "react-hot-toast";
import _ from "lodash";
import jwt, { JwtPayload } from "jsonwebtoken";

const dayOfWeeks = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AppointmentConfirmDialog({
  isOpen,
  setIsOpen,
  appointmentDate,
  schedule,
}: any) {
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
  const [customerId, setCustomerId] = useState<number>();

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

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: (_, variables) => {
      toast.success("Create appointment successfully!");

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);

      setIsOpen(false);
    },
  });

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const exp = decoded["exp"];
      if (
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ].length > 0
      ) {
        setCustomerId(
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
          ]
        );
      }
    } catch (err) {
      toast.error("Cannot get access token. Please login again.");
    }
  }, []);

  const handleBookAppointment = () => {
    mutate({
      clinicID: _.parseInt(clinic?.clinicID ?? "0"),
      clinicScheduleID: schedule?.scheduleID,
      customerID: customerId ?? 0,
      dentistID: dentist?.dentistId ?? 0,
      serviceID: _.parseInt(service?.serviceID ?? "0"),
      appointmentDate: moment(appointmentDate).format("YYYY-MM-DD"),
      appointmentTime: schedule?.openingTime,
      status: "string",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please confirm your appointment details</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col bg-shade-1-100% rounded-xl">
              <div className="flex flex-row gap-4 py-2 px-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <HospitalIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7"
                    >
                      {`Clinic: ${clinic?.name}`}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 ">
                    <MapPin className="w-4 h-6 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Address: ${clinic?.address}`}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <HandCoinsIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Service: ${service?.name}`}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Price: ${formatPriceToVND(service?.price ?? 0)}`}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <StethoscopeIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Dentist: ${dentist?.name}`}
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
                  <div className="flex flex-row gap-2 items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Date: ${
                        dayOfWeeks[moment(appointmentDate).day()]
                      }, ${moment(appointmentDate).format("DD-MM-YYYY")}`}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 text-wrap"
                    >
                      {`Time: ${moment(schedule?.openingTime).format(
                        "hh:mm a"
                      )} - ${moment(schedule?.closingTime).format("hh:mm a")}`}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button
            variant={"secondary"}
            className="text-shade-1-100%"
            onClick={() => handleBookAppointment()}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
