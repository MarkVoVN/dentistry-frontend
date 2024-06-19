"use client";

import SearchBar from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Typography } from "@/components/ui/typography";
import { formatPriceToVND } from "@/lib/utils";
import {
  ArrowRight,
  HospitalIcon,
  MapPinIcon,
  SquareUserIcon,
  StethoscopeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "path";
import React from "react";

export default function SearchPage() {
  const searchResult = {
    clinics: [
      {
        id: 1,
        name: "Clinic",
        address: "123 Main St",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        logo: undefined,
      },
      {
        id: 1,
        name: "Clinic",
        address: "123 Main St",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 1,
        name: "Clinic",
        address: "123 Main St",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    dentists: [
      {
        id: 1,
        name: "Dentist",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        image: undefined,
      },
      {
        id: 1,
        name: "Dentist",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      },
      {
        id: 1,
        name: "Dentist",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      },
    ],
    services: [
      {
        id: 1,
        name: "Service",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          logo: undefined,
        },
        fee: 2000000,
      },
      {
        id: 1,
        name: "Service",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        fee: 2000000,
      },
      {
        id: 1,
        name: "Service",
        clinic: {
          id: 1,
          name: "Clinic",
          address: "123 Main St",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        fee: 2000000,
      },
    ],
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
            <SearchBar></SearchBar>
          </div>
          <div className="flex flex-row justify-center gap-6">
            <Chip
              label={`All (${30})`}
              className="bg-secondary-100 border-secondary-100 text-secondary-600"
            />
            <Chip
              label={`Clinic (${10})`}
              className="bg-secondary-100 border-secondary-100 text-secondary-600"
            />

            <Chip
              label={`Dentist (${10})`}
              className="bg-secondary-100 border-secondary-100 text-secondary-600"
            />

            <Chip
              label={`Service (${10})`}
              className="bg-secondary-100 border-secondary-100 text-secondary-600"
            />
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

              <Link
                href="/search"
                className="flex flex-row items-center text-secondary-900"
              >
                View all
                <ArrowRight className="ml-2" width={20} height={20} />
              </Link>
            </div>

            <div className="flex flex-col ">
              {searchResult.clinics.map((clinic, index) => (
                <ClinicCard
                  key={index}
                  id={index}
                  name={clinic.name}
                  address={clinic.address}
                  description={clinic.description}
                  logo={clinic.logo}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col bg-shade-1-100% rounded-xl">
            <div className="flex flex-row justify-between p-6 pb-2">
              <Typography headingElement="h2" headingStyle={"h4"}>
                Dentists
              </Typography>

              <Link
                href="/search"
                className="flex flex-row items-center text-secondary-900"
              >
                View all
                <ArrowRight className="ml-2" width={20} height={20} />
              </Link>
            </div>

            <div className="flex flex-row gap-4 m-4 overflow-y-auto">
              {[...searchResult.dentists, ...searchResult.dentists].map(
                (dentist, index) => (
                  <DentistCard
                    key={index}
                    id={index}
                    name={dentist.name}
                    clinic={dentist.clinic}
                    image={dentist.image}
                  />
                )
              )}
            </div>
          </div>
          <div className="flex flex-col bg-shade-1-100% rounded-xl">
            <div className="flex flex-row justify-between p-6 pb-2">
              <Typography headingElement="h2" headingStyle={"h4"}>
                Services
              </Typography>

              <Link
                href="/search"
                className="flex flex-row items-center text-secondary-900"
              >
                View all
                <ArrowRight className="ml-2" width={20} height={20} />
              </Link>
            </div>

            <div className="flex flex-col ">
              {searchResult.services.map((service, index) => (
                <ServiceCard
                  key={index}
                  id={index}
                  name={service.name}
                  clinic={service.clinic}
                  fee={service.fee}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ClinicCard({
  id,
  name,
  address,
  description,
  logo,
}: {
  id: number;
  name: string;
  address: string;
  description: string;
  logo?: string;
}) {
  return (
    <div className="flex flex-row gap-4 hover:bg-neutral-2 py-4 px-8">
      {logo ? (
        <Image alt="clinic logo" src={logo} width={100} height={100} />
      ) : (
        <HospitalIcon width={100} height={100} className="p-4" />
      )}
      <div className="flex flex-col gap-2">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name} ${id}`}
        </Typography>
        <Typography
          headingElement="h5"
          headingStyle={"p"}
          className="text-neutral-7"
        >
          {address}
        </Typography>
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"secondary"}
          className="w-fit text-shade-1-100% px-4 rounded-full"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

function DentistCard({
  id,
  name,
  clinic,
  image,
}: {
  id: number;
  name: string;
  clinic: {
    id: number;
    name: string;
    address: string;
    description: string;
  };
  image?: string;
}) {
  return (
    <div className="flex flex-col gap-4 min-w-[260px] border-2 border-neutral-3 hover:border-secondary-500 rounded-xl">
      <div className="flex flex-col items-center justify-center">
        {image ? (
          <Image alt="clinic logo" src={image} width={200} height={200} />
        ) : (
          <SquareUserIcon width={200} height={200} className="p-4" />
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1 bg-secondary-100 rounded-xl py-4 px-4">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name} ${id}`}
        </Typography>
        <div className="flex flex-row gap-1">
          <MapPinIcon width={20} height={20} className=" text-neutral-7" />
          <div className="flex flex-col gap-2">
            <Typography
              headingElement="h5"
              headingStyle={"p"}
              className="text-neutral-7"
            >
              {`${clinic.name} ${id}`}
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
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"outline"}
          className="w-full text-secondary px-4 rounded-full"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

function ServiceCard({
  id,
  name,
  clinic,
  fee,
}: {
  id: number;
  name: string;
  clinic: {
    id: number;
    name: string;
    address: string;
    description: string;
    logo?: string;
  };
  fee: number;
}) {
  return (
    <div className="flex flex-row hover:bg-neutral-2 gap-4 py-4 px-8">
      <StethoscopeIcon width={100} height={100} className="p-4" />
      <div className="flex flex-col gap-2 flex-1">
        <Typography
          headingElement="h5"
          headingStyle={"h6"}
          className="text-secondary-900 font-bold"
        >
          {`${name} ${id}`}
        </Typography>
        <Typography
          headingElement="h5"
          headingStyle={"p"}
          className="text-secondary-900 font-bold"
        >
          {`Fee: ${formatPriceToVND(fee)}`}
        </Typography>
        <div className="flex flex-row gap-1">
          <MapPinIcon width={20} height={20} className=" text-neutral-7" />
          <div className="flex flex-col gap-2">
            <Typography
              headingElement="h5"
              headingStyle={"p"}
              className="text-neutral-7"
            >
              {`${clinic.name} ${id}`}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"secondary"}
          className="w-full text-shade-1-100% px-4 rounded-full"
        >
          Book Now
        </Button>
        <Button
          onClick={() => {
            console.log("clicked");
          }}
          variant={"outline"}
          className="w-fit px-4 rounded-full"
        >
          View detail
        </Button>
      </div>
    </div>
  );
}
