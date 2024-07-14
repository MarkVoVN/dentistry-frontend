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

export default function ClinicScheduleManagementPage() {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ClinicScheduleModel>();

  const [clinicId, setClinicId] = useState<number>();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const dentistId =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      mutate(dentistId);
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getDentistById,
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
      {clinicId && (
        <WeekCalendar
          clinicID={clinicId}
          setSelectedSchedule={setSelectedSchedule}
          defaultValues={{
            clinicId: clinicId,
          }}
        />
      )}
    </div>
  );
}
