import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import { ActionsDropdown } from "./components/actions-dropdown";
import { ServiceModel } from "@/lib/api/serviceAPI";

export const columns: (ColumnDef<ServiceModel> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {service.name}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {service.description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration (mins)",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {service.duration}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {service.price}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "clinicID",
    header: "Clinic",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {service.clinicDto?.name || "N/A"}
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
