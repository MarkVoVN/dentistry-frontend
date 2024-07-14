"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import AppointmentAddDialog from "./components/create-dialog"; // Adjust import as needed
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import {
  AppointmentModel,
  AppointmentQuery,
  getAppointmentList,
  queryAppointment,
} from "@/lib/api/appointmentAPI";
import useLocalStorage from "@/hooks/useLocalStorage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";
import toast from "react-hot-toast";

export default function AppointmentManagementPage() {
  const [itemList, setItemList] = useState<AppointmentModel[]>([]); // Initialize with AppointmentModel type
  const [query, setQuery] = useState<AppointmentQuery>({ ClinicID: "0" });
  const queryClient = useQueryClient();

  const [local_clinicOwnerId, setLocal_clinicOwnerId] = useLocalStorage<string>(
    "clinicOwnerId",
    "0"
  );

  const [local_clinicId, setLocal_clinicId] = useLocalStorage<number>(
    "clinicId",
    0
  );

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const clinicOwnerId =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      setLocal_clinicOwnerId(clinicOwnerId);
      mutate(clinicOwnerId);

      // setQuery({ ...query, DentistID: dentistId });
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getClinicOwnerById,
    onSuccess: (res, variables) => {
      console.log("success", res.data.clinicID);
      const { clinicID } = res.data;
      setLocal_clinicId(clinicID);
      setQuery({ ...query, ClinicID: clinicID });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["appointments", query],
    queryFn: () => queryAppointment(query),
  });

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
            defaultValues={{
              clinicID: local_clinicId,
            }}
            submitFunction={() => {}}
          />
        </div>
      </div>
      <DataTable columns={columns} data={itemList} />
    </div>
  );
}
