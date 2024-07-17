"use client";

import { ClinicScheduleModel } from "@/lib/api/clinicScheduleAPI";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WeekCalendar from "./calendar";
import ScheduleAddDialog from "./component/create-dialog";
import ClinicScheduleUpdateDialog from "./component/update-dialog";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useMutation } from "@tanstack/react-query";
import { getDentistById } from "@/lib/api/dentistAPI";
import toast from "react-hot-toast";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";

export default function ClinicScheduleManagementPage() {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ClinicScheduleModel>();

  const [clinicId, setClinicId] = useState<number>();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const coID =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      mutate(coID);
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getClinicOwnerById,
    onSuccess: (res, variables) => {
      const { clinicID } = res.data;

      setClinicId(clinicID);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <ScheduleAddDialog
        title="Add Schedule"
        buttonTitle="Add Schedule"
        defaultValues={{
          clinicId: clinicId ?? 0,
        }}
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
            clinicId: clinicId ?? 0,
            dayOfWeek: selectedSchedule?.dayOfWeek ?? "",
            slotDuration: selectedSchedule?.slotDuration ?? 60,
            openingTime: selectedSchedule?.openingTime ?? "",
            closingTime: selectedSchedule?.closingTime ?? "",
            maxPatientsPerSlot: selectedSchedule?.maxPatientsPerSlot ?? 1,
          }}
          submitFunction={() => {}}
        />
      )}
      {clinicId && (
        <WeekCalendar
          ClinicID={clinicId}
          setSelectedSchedule={setSelectedSchedule}
        />
      )}
    </div>
  );
}
