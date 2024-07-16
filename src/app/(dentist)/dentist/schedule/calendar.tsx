"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClinicScheduleModel,
  ClinicScheduleQuery,
  queryClinicScheduleList,
} from "@/lib/api/clinicScheduleAPI";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeekCalendar({ ClinicID, setSelectedSchedule }: any) {
  const [schedules, setSchedules] = useState<ClinicScheduleModel[]>([]);
  const [query, setQuery] = useState<ClinicScheduleQuery>({
    ClinicID: ClinicID,
  });

  const {
    data: scheduleData,
    isLoading: isLoadingSchedules,
    error: scheduleError,
    isError: isErrorSchedules,
    isSuccess: isSuccessSchedules,
  } = useQuery({
    queryKey: ["clinicSchedules", query],
    queryFn: () => queryClinicScheduleList(query),
  });

  useEffect(() => {
    if (isSuccessSchedules && scheduleData) {
      setSchedules(scheduleData.data);
    }
  }, [isSuccessSchedules, scheduleData]);

  const times: string[] = [];
  const startTime = moment("00:00", "HH:mm");
  const endTime = moment("24:00", "HH:mm");

  while (startTime.isSameOrBefore(endTime)) {
    times.push(startTime.format("HH:mm"));
    startTime.add(30, "minutes");
  }

  return (
    <Table className="table-fixed w-full h-full border-collapse">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 border">Time</TableHead>
          {days.map((day, index) => (
            <TableHead key={index} className="p-2 text-center border">
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {times.map((time, index) => {
          const [hour, minute] = time.split(":").map(Number);
          return (
            <TableRow key={time}>
              {minute === 0 && (
                <TableCell rowSpan={2} className="text-right pr-2 border">
                  {hour}:00
                </TableCell>
              )}
              {days.map((day, dayIndex) => (
                <TableCell key={dayIndex} className="relative h-4 border">
                  {schedules.map((rawSchedule) => {
                    const schedule = {
                      id: rawSchedule.scheduleID,
                      day: days.indexOf(rawSchedule.dayOfWeek),
                      openingHour:
                        moment(rawSchedule.openingTime).hours() +
                        moment(rawSchedule.openingTime).minutes() / 60,
                      closingHour:
                        moment(rawSchedule.closingTime).hours() +
                        moment(rawSchedule.closingTime).minutes() / 60,
                    };

                    const currentHour = hour + minute / 60;

                    if (
                      schedule.day === dayIndex &&
                      schedule.openingHour <= currentHour &&
                      schedule.closingHour > currentHour
                    ) {
                      const span =
                        (schedule.closingHour - schedule.openingHour) * 2;
                      const isFirstHalf =
                        minute === 0 && schedule.openingHour === currentHour;
                      const isSecondHalf =
                        minute === 30 && schedule.openingHour === currentHour;

                      if (isFirstHalf || isSecondHalf) {
                        return (
                          <div
                            key={schedule.id}
                            className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-secondary-600 text-white p-2 rounded-lg hover:border-2 hover:border-secondary"
                            style={{
                              top: 0,
                              height: `calc(${span} * 2rem)`,
                            }}
                            onClick={() => {
                              setSelectedSchedule(rawSchedule);
                            }}
                          >
                            {`${moment(rawSchedule.openingTime).format(
                              "hh:mm a"
                            )} - ${moment(rawSchedule.closingTime).format(
                              "hh:mm a"
                            )}`}
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
