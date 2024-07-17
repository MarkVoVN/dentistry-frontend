"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { ServiceModel, getServiceList } from "@/lib/api/serviceAPI"; // Update import paths
import ServiceAddDialog from "./components/create-dialog"; // Adjust import as needed
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";

export default function ServiceManagementPage() {
  const [itemList, setItemList] = useState<ServiceModel[]>([]); // Initialize with ServiceModel type

  const queryClient = useQueryClient();

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({ queryKey: ["services"], queryFn: getServiceList }); // Adjust queryKey and queryFn as per service API

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: services, pagination } = req_data;
      services.map((service: ServiceModel) => {
        service.id = service.serviceID;
        return service;
      });
      setItemList(services);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] }); // Adjust queryKey
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Service Management
          </h2>
          <p className="text-muted-foreground">
            Manage all services in the system...
            <button onClick={refetch}>Reset</button>
          </p>
        </div>
        <div>
          <ServiceAddDialog
            title="Add Service"
            buttonTitle="Add Service"
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
