import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import Image from "next/image";
import { ActionsDropdown } from "./components/actions-dropdown";
import { request } from "@/lib/utils/axios.config";
import { ClinicModel } from "@/lib/api/clinicAPI";
import { CustomerModel } from "@/lib/api/customerAPI";

export const columns: (ColumnDef<
  CustomerModel & {
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
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {customer.name}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {customer.address}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {customer.phoneNumber}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {customer.email}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="h-[48px] aspect-video">
          {customer?.image ? (
            <Image
              src={customer?.image}
              alt={customer.name}
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
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {customer.status ? "Active" : "In Active"}
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
