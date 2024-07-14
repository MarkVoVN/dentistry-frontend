"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import AppointmentAddDialog from "./components/create-dialog"; // Adjust import as needed
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import { AppointmentModel, getAppointmentList } from "@/lib/api/appointmentAPI";

export default function AppointmentManagementPage() {
  const [itemList, setItemList] = useState<AppointmentModel[]>([]); // Initialize with AppointmentModel type

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({ queryKey: ["appointments"], queryFn: getAppointmentList }); // Adjust queryKey and queryFn as per appointment API

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: appointments, pagination } = req_data;
      appointments.map((appointment: AppointmentModel) => {
        appointment.id = appointment.appointmentID.toString();
        return appointment;
      });
      setItemList(appointments);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] }); // Adjust queryKey
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Appointment Management
          </h2>
          <p className="text-muted-foreground">
            Manage all appointments in the system...
            <button onClick={refetch}>Reset</button>
          </p>
        </div>
        <div>
          <AppointmentAddDialog
            title="Add Appointment"
            buttonTitle="Add Appointment"
            submitFunction={() => {}}
          />
        </div>
      </div>
      <DataTable columns={columns} data={itemList} />
    </div>
  );
}
