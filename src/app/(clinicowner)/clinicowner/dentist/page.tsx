"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import {
  DentistModel,
  DentistQuery,
  getDentistList,
  queryDentist,
} from "@/lib/api/dentistAPI";
import DentistAddDialog from "./components/create-dialog";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useMutation } from "@tanstack/react-query";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";
import toast from "react-hot-toast";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function DentistManagementPage() {
  const [itemList, setItemList] = useState<DentistModel[]>([]); // Initialize with DentistModel type

  const [clinicId, setClinicId] = useLocalStorage<string>("ClinicID", "0");

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["dentists", clinicId],
    queryFn: () =>
      queryDentist({
        ClinicID: clinicId,
      }),
  }); // Adjust queryKey and queryFn as per dentist API

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

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: dentists, pagination } = req_data;
      dentists.map((dentist: DentistModel) => {
        dentist.id = String(dentist.dentistId);
        return dentist;
      });
      setItemList(dentists);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["dentists"] }); // Adjust queryKey
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Dentist Management
          </h2>
          <p className="text-muted-foreground">
            Manage all dentists in the system...
            <button onClick={refetch}>Reset</button>
          </p>
        </div>
        <div>
          <DentistAddDialog
            title="Add Dentist"
            buttonTitle="Add Dentist"
            submitFunction={() => {}}
            defaultValues={{
              clinicID: clinicId,
            }}
          />
        </div>
      </div>
      <DataTable columns={columns} data={itemList} />
    </div>
  );
}
