import { ColumnDef } from "@tanstack/react-table";
import { ActionsDropdown } from "./components/actions-dropdown";
import { ClinicOwnerModel } from "@/lib/api/clinicOwnerAPI";

export const columns: (ColumnDef<
  ClinicOwnerModel & {
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
      const clinicOwner = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinicOwner.name}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const clinicOwner = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinicOwner.phoneNumber}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const clinicOwner = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinicOwner.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "clinicName",
    header: "Clinic Name",
    cell: ({ row }) => {
      const clinicOwner = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {clinicOwner.clinicName}
          </p>
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
