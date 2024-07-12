"use client";

import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useQuery } from "@tanstack/react-query";
import { ClinicScheduleCreateModel, ClinicScheduleModel, fetchClinicScheduleList } from "@/lib/api/clinicScheduleAPI";
import DataCalendar from "./calendar";

export default function ClinicScheduleManagementPage() {
  const [itemList, setItemList] = useState<ClinicScheduleCreateModel[]>([]);
  
  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinicSchedules"],
    queryFn: fetchClinicScheduleList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: clinicSchedules, pagination } = req_data;
      setItemList(clinicSchedules);
    }
  }, [isSuccess, req_data]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <DataCalendar itemList={itemList} setItemList={setItemList}/>
    </div>
  );
}
