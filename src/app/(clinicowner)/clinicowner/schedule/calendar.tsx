"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { convertToDate, convertToHHMMSS } from "@/lib/utils";
import { Calendar, SlotInfo, View, Views, momentLocalizer } from "react-big-calendar";
import { ClinicScheduleCreateModel, ClinicScheduleModel } from "@/lib/api/clinicScheduleAPI";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ClinicAddDialog from "./component/create-dialog";
import ClinicUpdateDialog from "./component/update-dialog";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

type DataCalendarProps = {
    itemList: ClinicScheduleModel[];
    setItemList: React.Dispatch<React.SetStateAction<ClinicScheduleModel[]>>;
};

const DataCalendar: React.FC<DataCalendarProps> = ({ itemList, setItemList }) => {
  const [newSchedule, setNewSchedule] = useState<ClinicScheduleCreateModel>();
  const [view, setView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdModalOpen, setIsUpdModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const events = itemList.map((item) => {
    console.log(item.openingHours);
    
    return {
      id: item.scheduleId,
      title: item.dayOfWeek === "Working hour" ? "Working hour" : item.dayOfWeek,
      start: convertToDate(item.openingHours),
      end: convertToDate(item.closingHours)
    };
  });

  useEffect(() => {
    // Log itemList whenever it changes
    console.log("***itemList updated: ", itemList);
    console.log("***eventsList updated: ", events);
  }, [events]);

  useEffect(() => {
    // Log newSchedule newSchedule it changes
    console.log("***newSchedule updated: ", events);
  }, [newSchedule]);

  const handleSelect = (slot: SlotInfo) => {
    const title = window.prompt("New Event name");
    if (!title) return;

    const newItem: ClinicScheduleCreateModel = {
      clinicId: '1',
      dayOfWeek: days[slot.start.getDay() - 1],
      slotDuration: '',
      openingHours: convertToHHMMSS(slot.start),
      closingHours: convertToHHMMSS(slot.end),
      maxPatientsPerSlot: 0,
    };

    setNewSchedule(newItem);

    // TODO: Delete this
    setItemList((prevList) => {
      const updatedList = [...prevList, newItem];
      console.log(updatedList);

      return updatedList;
    });

    setIsUpdModalOpen(true);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setIsAddModalOpen(true);
  };

  return (
    <Calendar
      views={["month", "work_week"]}
      selectable
      localizer={localizer}
      view={view}
      date={currentDate}
      events={events}
      style={{ height: "100vh" }}
      onView={handleViewChange}
      onNavigate={handleNavigate}
      onSelectEvent={handleSelectEvent}
      onSelectSlot={(slot) => {
        console.log("slot select: ", slot.start);
        handleSelect(slot);
      }}
    >
      <ClinicAddDialog 
        title="Add Clinic Schedule"
        buttonTitle="Add Clinic Schedule"
        submitFunction={() => {}}
        defaultValues={newSchedule}
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} />

      {/* <ClinicUpdateDialog 
        submitFunction={undefined} 
        isOpen={isUpdModalOpen} 
        setIsOpen={setIsUpdModalOpen}
        defaultValues={}/> */}
    </Calendar>
  );
}

export default DataCalendar;