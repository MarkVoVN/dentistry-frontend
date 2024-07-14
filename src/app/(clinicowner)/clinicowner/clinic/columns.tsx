import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import Image from "next/image";
import { ActionsDropdown } from "./components/actions-dropdown";
import { request } from "@/lib/utils/axios.config";
import { ClinicModel } from "@/lib/api/clinicAPI";

export const columns: (ColumnDef<
  ClinicModel & {
    createdAt: any;
    updatedAt: any;
  }
> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinic.name}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinic.address}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinic.phoneNumber}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinic.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "openingHours",
    header: "Opening Hours",
    cell: ({ row }) => {
      return formatTime(row.getValue("openingHours"));
    },
  },
  {
    accessorKey: "closingHours",
    header: "Closing Hours",
    cell: ({ row }) => {
      return formatTime(row.getValue("closingHours"));
    },
  },
  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="h-[48px] aspect-video">
          {clinic?.image ? (
            <Image
              src={clinic?.image}
              alt={clinic.name}
              width={500}
              height={4500}
              className="w-full h-full object-cover p-0"
            />
          ) : (
            "No Image Available"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const clinic = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinic.status ? "Active" : "In Active"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      return <ActionsDropdown row={row} />;
    },
  },
];
