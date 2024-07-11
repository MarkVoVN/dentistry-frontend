"use client";

import React, { useEffect, useState } from "react";
import { Calendar, SlotInfo, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useQuery } from "@tanstack/react-query";
import { ClinicScheduleCreateModel, ClinicScheduleModel, fetchClinicScheduleList } from "@/lib/api/clinicScheduleAPI";
import { convertToHHMMSS, formatTime } from "@/lib/utils";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ClinicScheduleManagementPage() {
  const [itemList, setItemList] = useState<ClinicScheduleCreateModel[]>([]);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const {
    data: clinicSchedules,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinicSchedules"],
    queryFn: fetchClinicScheduleList,
  });

  useEffect(() => {
    setItemList(clinicSchedules);
  }, [isSuccess, clinicSchedules]);

  useErrorNotification({
    isError: isError,
    title: error?.message,
  });

  const handleSelect = (slot: SlotInfo) => {
    console.log(slot.start);
    console.log(slot.end);
    const title = window.prompt("New Event name");
    const newItem: ClinicScheduleCreateModel = {
      clinicId: "1",
      dayOfWeek: days[slot.start.getDay() - 1],
      slotDuration: "15",
      openingHours: convertToHHMMSS(slot.start.getHours() + ":" + slot.start.getMinutes() + ":" + slot.start.getSeconds()),
      closingHours: convertToHHMMSS(slot.end.getHours() + ":" + slot.end.getMinutes() + ":" + slot.end.getSeconds()),
      maxPatientsPerSlot: 3,
    }

    if (title)
    setItemList([
      ...itemList,
      { ...newItem}
    ]);
    console.log(newItem);
    console.log(itemList);
  };

  return (
    <div className="App">
      <Calendar
        views={["work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="work_week"
        style={{ height: "100vh" }}
        onSelectEvent={(event: any) => alert(event.title)}
        onSelectSlot={(slot) => {
          console.log("slot select: ", slot);
          handleSelect(slot);
        }}
      />
    </div>
  );
}
