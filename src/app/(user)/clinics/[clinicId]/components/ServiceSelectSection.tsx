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
import { AppointmentSelectionQuery } from "../page";

export default function ServiecSelectSection({
  appointmentSelectionQuery,
}: {
  appointmentSelectionQuery: AppointmentSelectionQuery;
}) {
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

  const defaultQuery: ServiceQuery & AppointmentSelectionQuery = {
    ClinicID: appointmentSelectionQuery.clinicId,
    SearchTerm: "",
    PageNumber: 1,
    PageSize: 5,
    ...decodedUrlParams,
  };

  // const [queryState, setQueryState] = useState<
  //   ServiceQuery & AppointmentSelectionQuery
  // >(query);

  const queryState: ServiceQuery & AppointmentSelectionQuery = defaultQuery;

  const [searchResult, setSearchResult] = useState<
    (ServiceModel & { clinicDto: ClinicModel })[]
  >([]);

  const [pagination, setPagination] = useState<any>();

  const {
    data: service_data,
    isLoading: service_isLoading,
    error: service_error,
    isError: service_isError,
    isSuccess: service_isSuccess,
  } = useQuery({
    queryKey: ["services", defaultQuery],
    queryFn: () => queryService(defaultQuery),
  });

  useEffect(() => {
    if (service_isSuccess && service_data) {
      const { data, pagination: req_pagination } = service_data;

      setPagination(req_pagination);
      setSearchResult(data);
    }
  }, [service_isSuccess, service_data]);

  useErrorNotification({
    isError: service_isError,
    title: service_error?.message,
  });

  const getRedirectSearchLink = (query: ClinicQuery) => {
    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(query).map((key) => {
      stringifiedParams[key] = JSON.stringify(query[key]);
    });
    const encodedQuery = new URLSearchParams(stringifiedParams);
    return `/clinics/${appointmentSelectionQuery.clinicId}?${encodedQuery}`;
  };

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

  const handleSelectService = (serviceId: string) => {
    if (queryState.clinicId && serviceId && queryState.dentistId) {
      redirectToAppointment(
        queryState.clinicId,
        serviceId,
        queryState.dentistId
      );
      return;
    }
    router.push(
      getRedirectSearchLink({
        serviceId,
      })
    );
  };

  return (
    <section className="w-1/2 flex flex-col gap-6">
      <div className="flex flex-col bg-shade-1-100% rounded-xl">
        <div className="flex flex-row justify-between p-6 pb-2">
          <Typography headingElement="h2" headingStyle={"h4"}>
            Services
          </Typography>
        </div>

        {service_isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col ">
            {searchResult?.map(
              (
                service: ServiceModel & { clinicDto: ClinicModel },
                index: number
              ) => (
                <ServiceCardWithoutClinic
                  key={index}
                  name={service.name}
                  price={service.price}
                  description={service.description}
                  duration={service.duration}
                  clinicID={service.clinicID}
                  serviceID={service.serviceID}
                  handleOnClickBookNow={() => {
                    handleSelectService(service.serviceID);
                  }}
                />
              )
            )}
          </div>
        )}
      </div>

      <div>
        {pagination?.TotalPages !== 1 && (
          <Pagination>
            <PaginationContent>
              {pagination?.CurrentPage !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={getRedirectSearchLink({
                      ...queryState,
                      PageNumber: pagination?.CurrentPage - 1,
                    })}
                  />
                </PaginationItem>
              )}
              {pagination &&
                Array.from({ length: pagination?.TotalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={getRedirectSearchLink({
                        ...queryState,
                        PageNumber: i + 1,
                      })}
                      className={cn(
                        i === pagination?.CurrentPage - 1
                          ? "bg-primary-600"
                          : "",
                        "px-3 py-2"
                      )}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {pagination?.CurrentPage !== pagination?.TotalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={getRedirectSearchLink({
                      ...queryState,
                      PageNumber: pagination?.CurrentPage + 1,
                    })}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
}
