"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";
import ClinicAddDialog from "./components/create-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function ClinicManagementPage() {
  const [itemList, setItemList] = useState([]);

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: clinics, pagination } = req_data;
      clinics.map((clinic: ClinicModel) => {
        clinic.id = clinic.clinicID;
        return clinic;
      });
      setItemList(clinics);
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
            Clinic Management
          </h2>
          <p className="text-muted-foreground">
            Manage all clinic in the system...
            <button onClick={refetch}>reset</button>
          </p>
        </div>
        <div>
          <ClinicAddDialog
            title="Add Clinic"
            buttonTitle="Add Clinic"
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
