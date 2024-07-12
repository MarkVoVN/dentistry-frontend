"use client";

import SearchBar from "@/components/shared/SearchBar";
import { Typography } from "@/components/ui/typography";
import { ClinicModel, ClinicQuery, queryClinic } from "@/lib/api/clinicAPI";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClinicCard, { ClinicCardSkeleton } from "../components/ClinicCard";
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

export default function SearchPage() {
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

  const query: ClinicQuery = {
    SearchTerm: "",
    PageNumber: 1,
    PageSize: 5,
    ...decodedUrlParams,
  };

  const { OrderBy, SearchTerm, Status, PageNumber, PageSize } = query;

  const [queryState, setQueryState] = useState<ClinicQuery>(query);

  const [searchResult, setSearchResult] = useState<ClinicModel[]>([]);

  const [pagination, setPagination] = useState<any>();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinics", query],
    queryFn: () => queryClinic(query),
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data, pagination: req_pagination } = req_data;

      setPagination(req_pagination);
      setSearchResult(data);
    }
  }, [isSuccess, req_data]);

  const getRedirectSearchLink = (query: ClinicQuery) => {
    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(query).map((key) => {
      stringifiedParams[key] = JSON.stringify(query[key]);
    });
    const encodedQuery = new URLSearchParams(stringifiedParams);
    return `/clinics?${encodedQuery}`;
  };

  const handleOnSearchEnter = () => {
    queryState.PageNumber = 1;
    router.push(getRedirectSearchLink(queryState));
  };

  return (
    <main className="flex flex-col items-center">
      <div className="w-full flex flex-row justify-center ">
        <section className="container py-16 ">
          <div className="flex flex-col items-center mb-10">
            <Typography
              headingElement="h2"
              headingStyle={"h1"}
              className="text-secondary-900 font-bold mb-4"
            >
              Search results for Clinics
            </Typography>
            <SearchBar
              searchInputValue={queryState.SearchTerm}
              setSearchInputValue={(value) =>
                setQueryState({
                  ...queryState,
                  SearchTerm: value,
                })
              }
              handleOnEnter={handleOnSearchEnter}
            ></SearchBar>
          </div>
        </section>
      </div>
      <div className="w-full flex flex-row justify-center bg-primary-100 py-12">
        <section className="w-1/2 flex flex-col gap-6">
          <div className="flex flex-col bg-shade-1-100% rounded-xl">
            <div className="flex flex-row justify-between p-6 pb-2">
              <Typography headingElement="h2" headingStyle={"h4"}>
                Clinics
              </Typography>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <ClinicCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col ">
                {searchResult?.map((clinic: ClinicModel, index: number) => (
                  <ClinicCard
                    key={index}
                    id={index}
                    name={clinic.name}
                    address={clinic.address}
                    description={`${clinic.openingHours} - ${clinic.closingHours}`}
                    logo={clinic.image}
                    isLoading={isLoading}
                    onClickBookNow={() => {
                      router.push(`/clinics/${clinic.clinicID}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                {pagination?.CurrentPage !== 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={getRedirectSearchLink({
                        ...query,
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
                          ...query,
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
                {/* <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem> */}
                {pagination?.CurrentPage !== pagination?.TotalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={getRedirectSearchLink({
                        ...query,
                        PageNumber: pagination?.CurrentPage + 1,
                      })}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </div>
    </main>
  );
}
