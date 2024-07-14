"use client";

import { ClinicScheduleModel } from "@/lib/api/clinicScheduleAPI";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WeekCalendar from "./calendar";
import ScheduleAddDialog from "./component/create-dialog";
import ClinicScheduleUpdateDialog from "./component/update-dialog";

export default function ClinicScheduleManagementPage({
  params: { clinicId },
}: any) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ClinicScheduleModel>();

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <ScheduleAddDialog
        title="Add Schedule"
        buttonTitle="Add Schedule"
        submitFunction={() => {}}
      />
      {selectedSchedule && (
        <ClinicScheduleUpdateDialog
          title="Update Schedule"
          buttonTitle="Update Schedule"
          open={selectedSchedule !== undefined}
          onOpenChange={() => setSelectedSchedule(undefined)}
          defaultValues={{
            scheduleId: selectedSchedule?.scheduleID ?? "",
            clinicId: clinicId,
            dayOfWeek: selectedSchedule?.dayOfWeek ?? "",
            slotDuration: selectedSchedule?.slotDuration ?? 60,
            openingTime: selectedSchedule?.openingTime ?? "",
            closingTime: selectedSchedule?.closingTime ?? "",
            maxPatientsPerSlot: selectedSchedule?.maxPatientsPerSlot ?? 1,
          }}
          submitFunction={() => {}}
        />
      )}

      <WeekCalendar
        clinicID={clinicId}
        setSelectedSchedule={setSelectedSchedule}
        defaultValues={{
          clinicId: clinicId,
        }}
      />
    </div>
  );
}
