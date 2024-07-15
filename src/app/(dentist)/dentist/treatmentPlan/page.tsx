"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { ServiceModel, getServiceList } from "@/lib/api/serviceAPI"; // Update import paths
import ServiceAddDialog from "./components/create-dialog"; // Adjust import as needed
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import {
  getTreatmentPlanList,
  queryTreatmentPlan,
  TreatmentPlanModel,
  TreatmentPlanQuery,
} from "@/lib/api/treatmentPlanAPI";
import TreatmentPlanAddDialog from "./components/create-dialog";
import jwt, { JwtPayload } from "jsonwebtoken";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getDentistById } from "@/lib/api/dentistAPI";
import toast from "react-hot-toast";
import { queryAppointment } from "@/lib/api/appointmentAPI";
import _ from "lodash";

export default function ServiceManagementPage() {
  const [itemList, setItemList] = useState<TreatmentPlanModel[]>([]);
  const [query, setQuery] = useState<TreatmentPlanQuery>({ DentistID: "0" });
  const queryClient = useQueryClient();
  const [local_dentistId, setLocal_dentistId] = useLocalStorage<string>(
    "dentistId",
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
      const dentistId =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      setLocal_dentistId(dentistId);
      mutate(dentistId);

      setQuery({ ...query, DentistID: dentistId });
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getDentistById,
    onSuccess: (res, variables) => {
      const { clinicID } = res.data;
      setLocal_clinicId(clinicID);
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
    queryKey: ["treatmentPlans", query],
    queryFn: () => queryTreatmentPlan(query),
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: tplans, pagination } = req_data;
      setItemList(tplans);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] }); // Adjust queryKey
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Treatment Plan Management
          </h2>
          <p className="text-muted-foreground">
            Manage all services in the system...
            <button onClick={refetch}>Reset</button>
          </p>
        </div>
        <div>
          <TreatmentPlanAddDialog
            title="Add Treatment Plan"
            buttonTitle="Add Treatment Plan"
            defaultValues={{
              dentistID: _.parseInt(local_dentistId),
            }}
            submitFunction={() => {}}
          />
        </div>
      </div>
      <DataTable columns={columns} data={itemList} />
    </div>
  );
}
