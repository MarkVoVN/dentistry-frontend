"use client";

import React, { useState } from "react";
import moment from "moment";
import { convertToHHMMSS } from "@/lib/utils";
import { Calendar, SlotInfo, View, Views, momentLocalizer } from "react-big-calendar";
import { ClinicScheduleCreateModel } from "@/lib/api/clinicScheduleAPI";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

type DataCalendarProps = {
    itemList: ClinicScheduleCreateModel[];
    setItemList: React.Dispatch<React.SetStateAction<ClinicScheduleCreateModel[]>>;
  };

const DataCalendar: React.FC<DataCalendarProps> = ({ itemList, setItemList }) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSelect = (slot: SlotInfo) => {
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

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <Calendar
        views={["month", "work_week"]}
        selectable
        localizer={localizer}
        view={view}
        date={currentDate}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        style={{ height: "100vh" }}
        onSelectEvent={(event: any) => alert(event.title)}
        onSelectSlot={(slot) => {
          console.log("slot select: ", slot);
          handleSelect(slot);
        }}
      />
  );
}

export default DataCalendar;