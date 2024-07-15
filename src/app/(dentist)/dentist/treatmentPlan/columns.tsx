import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import { ActionsDropdown } from "./components/actions-dropdown";
import { TreatmentPlanModel } from "@/lib/api/treatmentPlanAPI";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: (ColumnDef<TreatmentPlanModel> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "customerID",
    header: "Customer",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {treatmentPlan.customer?.name ?? "N/A"}
          </h3>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "dentistID",
  //   header: "Dentist ID",
  //   cell: ({ row }) => {
  //     const treatmentPlan = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {treatmentPlan.dentistID}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {moment(treatmentPlan.startDate).format("DD/MM/YYYY")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {treatmentPlan.endDate
              ? moment(treatmentPlan.endDate).format("DD/MM/YYYY")
              : "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip delayDuration={700}>
              <TooltipTrigger asChild>
                <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap max-w-[270px] truncate cursor-default hover:shadow-sm">
                  {treatmentPlan.description}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap ">
                  {treatmentPlan.description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "nextAppointmentDate",
    header: "Next Appointment Date",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {treatmentPlan.nextAppointmentDate
              ? moment(treatmentPlan.nextAppointmentDate).format("DD/MM/YYYY")
              : "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {treatmentPlan.status}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const treatmentPlan = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {treatmentPlan.paymentStatus}
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
