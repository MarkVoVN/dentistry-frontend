"use client";

import SearchBar from "@/components/shared/SearchBar";
import { Chip } from "@/components/ui/chip";
import { Typography } from "@/components/ui/typography";
import { ClinicModel, ClinicQuery } from "@/lib/api/clinicAPI";
import { ServiceModel } from "@/lib/api/serviceAPI";
import { getSearchResult } from "@/lib/api/userAPI";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClinicCard from "../components/ClinicCard";
import DentistCard from "../components/DentistCard";
import ServiceCard from "../components/ServiceCard";
import { DentistModel } from "@/lib/api/dentistAPI";

type SearchResult = {
  clinics: ClinicModel[];
  dentists: (DentistModel & { clinic: ClinicModel })[];
  services: (ServiceModel & { clinicDto: ClinicModel })[];
  count: {
    All: number;
    Clinics: number;
    Dentists: number;
    Services: number;
    [key: string]: any;
  };
  [key: string]: any;
};

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

  const [search, setSearch] = useState<string>(decodedUrlParams.search);

  const [searchResult, setSearchResult] = useState<SearchResult>({
    clinics: [],
    dentists: [],
    services: [],
    count: {
      Clinics: 0,
      Dentists: 0,
      Services: 0,
      All: 0,
    },
  });

  const [activeSearchTab, setActiveSearchTab] = useState<
    "All" | "Clinics" | "Dentists" | "Services"
  >("All");

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["search", search],
    queryFn: () => getSearchResult({ SearchTerm: search }),
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data, pagination } = req_data;
      data.count = {
        All: data.clinics.length + data.dentists.length + data.services.length,
        Clinics: data.clinics.length,
        Dentists: data.dentists.length,
        Services: data.services.length,
      };

      setSearchResult(data);
    }
  }, [isSuccess, req_data]);

  const getRedirectSearchLink = (page: string) => {
    if (!search || search.trim().length === 0) return `/${page}`;
    let queryParams: ClinicQuery & { [key: string]: any } = {
      SearchTerm: search,
      PageNumber: 1,
      PageSize: 5,
    };

    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(queryParams).map((key) => {
      stringifiedParams[key] = JSON.stringify(queryParams[key]);
    });
    const query = new URLSearchParams(stringifiedParams);
    return `/${page}?${query}`;
  };

  const redirectToSearchPage = () => {
    if (!search || search.trim().length === 0) return;
    let queryParams: { [key: string]: string } = {
      search: search,
    };

    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(queryParams).map((key) => {
      stringifiedParams[key] = JSON.stringify(queryParams[key]);
    });
    const query = new URLSearchParams(stringifiedParams);
    router.push(`/search?${query}`);
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
              Search results
            </Typography>
            <SearchBar
              searchInputValue={search}
              setSearchInputValue={setSearch}
              handleOnEnter={redirectToSearchPage}
            ></SearchBar>
          </div>
          <div className="flex flex-row justify-center gap-6">
            {["All", "Clinics", "Dentists", "Services"].map((tab, index) => {
              return (
                <Chip
                  key={index}
                  label={`${tab} (${searchResult.count[tab] ?? 0})`}
                  className={cn(
                    activeSearchTab === tab
                      ? "bg-secondary-600 border-secondary-600 text-secondary-100"
                      : "bg-secondary-100 border-secondary-100 text-secondary-600"
                  )}
                  onClick={() =>
                    setActiveSearchTab(
                      tab as "All" | "Clinics" | "Dentists" | "Services"
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      </div>
      <div className="w-full flex flex-row justify-center bg-primary-100 py-12">
        <section className="w-1/2 flex flex-col gap-6">
          {(activeSearchTab === "All" || activeSearchTab === "Clinics") &&
            searchResult?.clinics?.length > 0 && (
              <div className="flex flex-col bg-shade-1-100% rounded-xl">
                <div className="flex flex-row justify-between p-6 pb-2">
                  <Typography headingElement="h2" headingStyle={"h4"}>
                    Clinics
                  </Typography>

                  <Link
                    href={getRedirectSearchLink("clinics")}
                    className="flex flex-row items-center text-secondary-900"
                  >
                    View all
                    <ArrowRight className="ml-2" width={20} height={20} />
                  </Link>
                </div>

                <div className="flex flex-col ">
                  {searchResult?.clinics?.map(
                    (clinic: ClinicModel, index: number) => (
                      <ClinicCard
                        key={index}
                        id={index}
                        name={clinic.name}
                        address={clinic.address}
                        description={`${clinic.openingHours} - ${clinic.closingHours}`}
                        logo={clinic.image}
                        onClickBookNow={() =>
                          router.push(`/clinics/${clinic.clinicID}`)
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
          {(activeSearchTab === "All" || activeSearchTab === "Dentists") &&
            searchResult?.dentists?.length > 0 && (
              <div className="flex flex-col bg-shade-1-100% rounded-xl">
                <div className="flex flex-row justify-between p-6 pb-2">
                  <Typography headingElement="h2" headingStyle={"h4"}>
                    Dentists
                  </Typography>

                  {/* <Link
                    href="/search"
                    className="flex flex-row items-center text-secondary-900"
                  >
                    View all
                    <ArrowRight className="ml-2" width={20} height={20} />
                  </Link> */}
                </div>

                <div className="flex flex-row gap-4 m-4 overflow-y-auto">
                  {searchResult?.dentists?.map(
                    (
                      dentist: DentistModel & { clinic: ClinicModel },
                      index: number
                    ) => (
                      <DentistCard
                        key={index}
                        id={index}
                        dentist={dentist}
                        name={dentist.name}
                        clinic={dentist.clinic}
                        image={dentist.image}
                        handleBookNow={() =>
                          router.push(
                            `/clinics/${dentist.clinic.clinicID}?dentistId=${dentist.dentistId}`
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
          {(activeSearchTab === "All" || activeSearchTab === "Services") &&
            searchResult?.services?.length > 0 && (
              <div className="flex flex-col bg-shade-1-100% rounded-xl">
                <div className="flex flex-row justify-between p-6 pb-2">
                  <Typography headingElement="h2" headingStyle={"h4"}>
                    Services
                  </Typography>

                  {/* <Link
                    href="/search"
                    className="flex flex-row items-center text-secondary-900"
                  >
                    View all
                    <ArrowRight className="ml-2" width={20} height={20} />
                  </Link> */}
                </div>

                <div className="flex flex-col ">
                  {searchResult?.services?.map(
                    (
                      service: ServiceModel & { clinicDto: ClinicModel },
                      index: number
                    ) => (
                      <ServiceCard
                        key={index}
                        id={index}
                        name={service.name}
                        clinic={service.clinicDto}
                        fee={service.price}
                        handleBookNow={() =>
                          router.push(
                            `/clinics/${service.clinicDto.clinicID}?serviceId=${service.serviceID}`
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
          {searchResult?.count.All === 0 && (
            <div className="flex flex-row justify-center py-24">
              <Typography
                headingElement="h2"
                headingStyle={"h4"}
                className="text-neutral-6 italic"
              >
                No results found. Please try a different keyword.
              </Typography>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
