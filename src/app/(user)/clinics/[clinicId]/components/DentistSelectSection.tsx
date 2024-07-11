"use client";

import { Typography } from "@/components/ui/typography";
import { ClinicModel } from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DentistCardSkeletonWithoutClinic,
  DentistCardWithoutClinic,
} from "@/app/(user)/components/DentistCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { DentistModel, queryDentist } from "@/lib/api/dentistAPI";
import { ServiceQuery } from "@/lib/api/serviceAPI";
import { cn } from "@/lib/utils";
import { AppointmentSelectionQuery } from "../page";

export default function DentistSelectSection({
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
    ...appointmentSelectionQuery,
  };

  // const [queryState, setQueryState] = useState<
  //   ServiceQuery & AppointmentSelectionQuery
  // >(query);

  const queryState: ServiceQuery & AppointmentSelectionQuery = defaultQuery;

  const [searchResult, setSearchResult] = useState<
    (DentistModel & { clinic: ClinicModel })[]
  >([]);

  const [pagination, setPagination] = useState<any>();

  const {
    data: dentist_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["dentists", defaultQuery],
    queryFn: () => queryDentist(defaultQuery),
  });

  useEffect(() => {
    if (isSuccess && dentist_data) {
      const { data, pagination: req_pagination } = dentist_data;

      setPagination(req_pagination);
      setSearchResult(data);
    }
  }, [isSuccess, dentist_data]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  const getRedirectSearchLink = (query: any) => {
    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(query).map((key) => {
      stringifiedParams[key] = JSON.stringify(query[key]);
    });
    const encodedQuery = new URLSearchParams(stringifiedParams);
    return `/clinics/${queryState.clinicId}?${encodedQuery}`;
  };

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

  // const handleOnSearchEnter = () => {
  //   queryState.PageNumber = 1;
  //   router.push(getRedirectSearchLink(queryState));
  // };

  const handleSelect = (dentistId: any) => {
    if (queryState.clinicId && queryState.serviceId && dentistId) {
      redirectToAppointment(
        queryState.clinicId,
        queryState.serviceId,
        dentistId
      );
      return;
    }
    router.push(
      getRedirectSearchLink({
        dentistId,
      })
    );
  };

  return (
    <section className="w-1/2 flex flex-col gap-6">
      <div className="flex flex-col bg-shade-1-100% rounded-xl">
        <div className="flex flex-row justify-between p-6 pb-2">
          <Typography headingElement="h2" headingStyle={"h4"}>
            Dentists
          </Typography>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <DentistCardSkeletonWithoutClinic key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col ">
            {searchResult?.map(
              (data: DentistModel & { clinic: ClinicModel }, index: number) => (
                <DentistCardWithoutClinic
                  key={index}
                  name={data.name}
                  image={data.image}
                  specialization={data.specialization}
                  handleOnClickBookNow={() => {
                    handleSelect(data.dentistId);
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
