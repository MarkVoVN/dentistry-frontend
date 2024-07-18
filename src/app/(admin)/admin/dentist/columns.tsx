import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import { ActionsDropdown } from "./components/actions-dropdown";
import { DentistModel } from "@/lib/api/dentistAPI";

export const columns: (ColumnDef<DentistModel> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.id}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.name}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.phoneNumber}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.specialization}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "clinic",
    header: "Clinic",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.clinic?.name}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const dentist = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {dentist.status
              ? "Được phép hành nghề"
              : "Không được phép hành nghề"}
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
