"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import ClinicOwnerAddDialog from "./components/create-dialog";
import {
  ClinicOwnerModel,
  fetchClinicOwnerList,
} from "@/lib/api/clinicOwnerAPI";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function ClinicOwnerManagementPage() {
  const [itemList, setItemList] = useState([]);

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinicOwners"],
    queryFn: fetchClinicOwnerList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: clinicOwners, pagination } = req_data;
      clinicOwners.map((clinicOwner: ClinicOwnerModel) => {
        clinicOwner.id = clinicOwner.ownerID?.toString();
        return clinicOwner;
      });
      setItemList(clinicOwners);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Clinic Owner Management
          </h2>
          <p className="text-muted-foreground">
            Manage all clinic owners in the system...
            <button onClick={refetch}>reset</button>
          </p>
        </div>
        <div>
          <ClinicOwnerAddDialog
            title="Add Clinic Owner"
            buttonTitle="Add Clinic Owner"
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
