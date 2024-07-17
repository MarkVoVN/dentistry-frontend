"use client";

import { useErrorNotification } from "@/hooks/useErrorNotification";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";
import {
  queryTreatmentPlan,
  TreatmentPlanModel,
} from "@/lib/api/treatmentPlanAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function ServiceManagementPage() {
  const [itemList, setItemList] = useState<TreatmentPlanModel[]>([]); // Initialize with ServiceModel type
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
    queryKey: ["treatmentPlans", clinicId],
    queryFn: () => queryTreatmentPlan({ ClinicID: clinicId }),
  }); // Adjust queryKey and queryFn as per service API

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: items, pagination } = req_data;

      setItemList(items);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["treatmentPlan"] }); // Adjust queryKey
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
          {/* <TreatmentPlanAddDialog
            title="Add Treatment Plan"
            buttonTitle="Add Treatment Plan"
            submitFunction={() => {}}
            defaultValues={{
              clinicID: clinicId,
            }}
          /> */}
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
