"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { ServiceModel, getServiceList } from "@/lib/api/serviceAPI"; // Update import paths
import ServiceAddDialog from "./components/create-dialog"; // Adjust import as needed
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import {
  getTreatmentPlanList,
  TreatmentPlanModel,
} from "@/lib/api/treatmentPlanAPI";
import TreatmentPlanAddDialog from "./components/create-dialog";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function ServiceManagementPage() {
  const [itemList, setItemList] = useState<TreatmentPlanModel[]>([]); // Initialize with ServiceModel type

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({ queryKey: ["treatmentPlans"], queryFn: getTreatmentPlanList }); // Adjust queryKey and queryFn as per service API

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
          <TreatmentPlanAddDialog
            title="Add Treatment Plan"
            buttonTitle="Add Treatment Plan"
            submitFunction={() => {}}
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
