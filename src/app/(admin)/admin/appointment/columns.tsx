import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatTime } from "@/lib/utils";
import { AppointmentModel } from "@/lib/api/appointmentAPI";
import { ActionsDropdown } from "./components/actions-dropdown";
import moment from "moment";

export const columns: (ColumnDef<AppointmentModel> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "appointmentID",
    header: "Appointment ID",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.appointmentID}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "customerID",
    header: "Customer ID",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.customerID}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "clinicScheduleID",
    header: "Clinic Schedule ID",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.clinicScheduleID}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "customerName",
  //   header: "Customer Name",
  //   cell: ({ row }) => {
  //     const appointment = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {appointment.customerName}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "address",
  //   header: "Address",
  //   cell: ({ row }) => {
  //     const appointment = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {appointment.address}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "phoneNumber",
  //   header: "Phone Number",
  //   cell: ({ row }) => {
  //     const appointment = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {appointment.phoneNumber}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "dentistID",
    header: "Dentist ID",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.dentistID}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "dentistName",
  //   header: "Dentist Name",
  //   cell: ({ row }) => {
  //     const appointment = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {appointment.dentistName}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "serviceID",
    header: "Service ID",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.serviceID}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "serviceName",
  //   header: "Service Name",
  //   cell: ({ row }) => {
  //     const appointment = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //           {appointment.serviceName}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "appointmentDate",
    header: "Appointment Date",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {moment(appointment.appointmentDate).format("DD-MM-YYYY")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "appointmentTime",
    header: "Appointment Time",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {moment(appointment.appointmentTime).format("DD-MM-YYYY hh:mm:ss")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {appointment.status}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsDropdown row={row} />;
    },
  },
];
