"use client";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { CustomerModel, fetchCustomerList } from "@/lib/api/customerAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";
export default function CustomerPage() {
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
    queryFn: fetchCustomerList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: customers, pagination } = req_data;

      setItemList(customers);
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
            Customer Management
          </h2>
          <p className="text-muted-foreground">
            Manage all customer in the system...
            <button onClick={refetch}>reset</button>
          </p>
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
