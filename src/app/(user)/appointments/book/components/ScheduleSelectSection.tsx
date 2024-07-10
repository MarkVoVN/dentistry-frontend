"use client";

import { Typography } from "@/components/ui/typography";
import { ClinicModel, ClinicQuery } from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ServiceCardSkeleton,
  ServiceCardWithoutClinic,
} from "@/app/(user)/components/ServiceCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { queryService, ServiceModel, ServiceQuery } from "@/lib/api/serviceAPI";
import { cn } from "@/lib/utils";
import {
  querySchedule,
  ScheduleModel,
  ScheduleQuery,
} from "@/lib/api/scheduleAPI";
import moment from "moment";

export default function ScheduleSelectSection() {
  const urlParams = useSearchParams();
  const router = useRouter();
  let decodedUrlParams: any = {};
  Array.from(urlParams.entries()).forEach((pair) => {
    try {
      decodedUrlParams[pair[0]] = JSON.parse(pair[1]);
    } catch (error) {
      return;
    }
  });

  const defaultQuery: ScheduleQuery = {
    ClinicID: decodedUrlParams["clinicId"],
    ViewType: "available",
  };

  // const [queryState, setQueryState] = useState<
  //   ServiceQuery & AppointmentSelectionQuery
  // >(query);

  // const queryState: ServiceQuery & AppointmentSelectionQuery = defaultQuery;

  const [scheduleList, setScheduleList] = useState<ScheduleModel[]>([]);

  // const [pagination, setPagination] = useState<any>();

  const {
    data: schedule_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["schedule", defaultQuery],
    queryFn: () => querySchedule(defaultQuery),
  });

  useEffect(() => {
    if (isSuccess && schedule_data) {
      const { data, pagination: req_pagination } = schedule_data;

      // setPagination(req_pagination);
      setScheduleList(data);
    }
  }, [isSuccess, schedule_data]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  // const getRedirectSearchLink = (query: ClinicQuery) => {
  //   let stringifiedParams: { [key: string]: string } = {};
  //   Object.keys(query).map((key) => {
  //     stringifiedParams[key] = JSON.stringify(query[key]);
  //   });
  //   const encodedQuery = new URLSearchParams(stringifiedParams);
  //   return `/clinics/${appointmentSelectionQuery.clinicId}?${encodedQuery}`;
  // };

  // const handleOnSearchEnter = () => {
  //   queryState.PageNumber = 1;
  //   router.push(getRedirectSearchLink(queryState));
  // };

  const redirectToAppointment = (
    clinicId: string | number,
    serviceId: string | number,
    dentistId: string | number
  ) => {
    const encodedQuery = new URLSearchParams({
      clinicId: JSON.stringify(clinicId),
      serviceId: JSON.stringify(serviceId),
      dentistId: JSON.stringify(dentistId),
    });
    router.push(`/appointments/book?${encodedQuery}`);
  };

  // const handleSelectService = (serviceId: string) => {
  //   if (queryState.clinicId && serviceId && queryState.dentistId) {
  //     redirectToAppointment(
  //       queryState.clinicId,
  //       serviceId,
  //       queryState.dentistId
  //     );
  //     return;
  //   }
  //   router.push(
  //     getRedirectSearchLink({
  //       serviceId,
  //     })
  //   );
  // };

  return (
    <section className="w-1/2 flex flex-col gap-6">
      <div className="flex flex-col bg-shade-1-100% rounded-xl">
        <div className="flex flex-row justify-between p-6 pb-2">
          <Typography headingElement="h2" headingStyle={"h4"}>
            Services
          </Typography>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col ">
            {scheduleList?.map((schedule: ScheduleModel, index: number) => (
              <div
                className="flex flex-col bg-shade-1-100% rounded-xl"
                key={index}
              >
                <div className="flex flex-row justify-between p-6 pb-2">
                  <Typography headingElement="h2" headingStyle={"h4"}>
                    {`${schedule?.dayOfWeek}`}
                  </Typography>
                </div>
                <div className="flex flex-row gap-4 py-4 px-8">
                  <div className="flex flex-col gap-2">
                    <Typography
                      headingElement="h5"
                      headingStyle={"h6"}
                      className="text-secondary-900 font-bold"
                    >
                      {` ${moment(schedule?.openingTime).format(
                        "hh:mm a"
                      )} - ${moment(schedule?.closingTime).format("hh:mm a")}`}
                    </Typography>
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7"
                    >
                      {`Duration: ${schedule?.slotDuration} minutes`}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
