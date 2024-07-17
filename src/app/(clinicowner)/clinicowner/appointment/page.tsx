"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import AppointmentAddDialog from "./components/create-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import {
  AppointmentModel,
  getAppointmentList,
  queryAppointment,
} from "@/lib/api/appointmentAPI";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useMutation } from "@tanstack/react-query";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";
import toast from "react-hot-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import _ from "lodash";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function AppointmentManagementPage() {
  const [itemList, setItemList] = useState<AppointmentModel[]>([]);
  const [clinicId, setClinicId] = useLocalStorage<string>("ClinicID", "0");

  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const coID =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      mutate(coID);
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getClinicOwnerById,
    onSuccess: (res, variables) => {
      const { clinicID } = res.data;
      setClinicId(clinicID);
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
    queryKey: ["appointments", clinicId],
    queryFn: () => queryAppointment({ ClinicID: clinicId }),
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
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
            defaultValues={{
              clinicID: _.parseInt(clinicId ?? "0"),
            }}
          />
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable columns={columns} data={itemList} />
      )}
    </div>
  );
}
