"use client";

import { Typography } from "@/components/ui/typography";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ServiceCardSkeleton } from "@/app/(user)/components/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import {
  querySchedule,
  ScheduleModel,
  ScheduleQuery,
} from "@/lib/api/scheduleAPI";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentConfirmDialog from "./ApppintmentConfirmDialog";

const dayOfWeeks = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type SortedSchedules = {
  Morning: ScheduleModel[];
  Afternoon: ScheduleModel[];
  Evening: ScheduleModel[];
  [key: string]: ScheduleModel[];
};

export default function ScheduleSelectSection() {
  const urlParams = useSearchParams();
  const router = useRouter();
  let decodedUrlParams: any = {};
  Array.from(urlParams.entries()).forEach((pair) => {
    try {
      decodedUrlParams[pair[0]] = JSON.parse(pair[1]);
    } catch (error) {
      return;
    }
  });

  const defaultQuery: ScheduleQuery = {
    ClinicID: decodedUrlParams["clinicId"],
    ViewType: "available",
  };

  const [scheduleList, setScheduleList] = useState<SortedSchedules>({
    Morning: [],
    Afternoon: [],
    Evening: [],
  });

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleModel>();

  const [queryState, setQueryState] = useState<ScheduleQuery>({
    ClinicID: decodedUrlParams["clinicId"],
    Date: moment(selectedDay).format("YYYY-MM-DD"),
    ViewType: "available",
  });

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: querySchedule,
    onSuccess: ({ data, pagination: req_pagination }) => {
      let sortedSchedule: SortedSchedules = {
        Morning: [],
        Afternoon: [],
        Evening: [],
      };

      data.forEach((schedule: ScheduleModel) => {
        const closingTime = moment(schedule.closingTime);
        const hour = closingTime.hour();

        if (hour <= 12) {
          sortedSchedule.Morning.push(schedule);
        } else if (hour > 12 && hour <= 17) {
          sortedSchedule.Afternoon.push(schedule);
        } else {
          sortedSchedule.Evening.push(schedule);
        }
      });

      setScheduleList(sortedSchedule);
    },
    onError: (error) => {
      toast.error(`ERROR: ${error.message}`);
    },
  });

  useEffect(() => {
    mutate(queryState);
  }, [queryState]);

  useEffect(() => {
    if (queryState.Date !== moment(selectedDay).format("YYYY-MM-DD")) {
      setQueryState((prev) => {
        return {
          ...prev,
          Date: moment(selectedDay).format("YYYY-MM-DD"),
        };
      });
    }
  }, [selectedDay]);

  return (
    <section className="w-1/2 flex flex-col gap-6">
      <div className="flex flex-col bg-shade-1-100% rounded-xl pb-4">
        <div className="flex flex-row justify-between px-4 py-2 rounded-t-xl bg-secondary-600 text-shade-1-100% ">
          <Typography headingElement="h2" headingStyle={"h6"}>
            Pick your appointment date and time
          </Typography>
        </div>
        <div className="flex flex-row justify-between p-6 pb-2">
          <Typography headingElement="h2" headingStyle={"h6"}>
            Appointment Date
          </Typography>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !selectedDay && "text-muted-foreground"
                )}
                size={"sm"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDay ? (
                  moment(selectedDay).format("DD-MM-YYYY")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                initialFocus
                weekStartsOn={1}
              />
            </PopoverContent>
          </Popover>
        </div>

        {status === "pending" ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 px-6">
              {["Morning", "Afternoon", "Evening"].map((day, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-[160px] "></Skeleton>
                  </div>
                  <div className="flex flex-row gap-2 flex-wrap">
                    {Array(6)
                      .fill(0)
                      .map((_, idx) => (
                        <Skeleton
                          key={idx}
                          className="h-8 w-[160px] p-2"
                        ></Skeleton>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-6">
            {["Morning", "Afternoon", "Evening"].map(
              (day: string, index: number) => (
                <React.Fragment key={index}>
                  {scheduleList[day].length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <Typography
                          headingElement="h5"
                          headingStyle={"h6"}
                          className=""
                        >
                          {day}
                        </Typography>
                      </div>
                      <div className="flex flex-row gap-2 flex-wrap">
                        {scheduleList[day].map(
                          (schedule: ScheduleModel, index: number) => (
                            <div
                              className="flex flex-row justify-center w-[160px] p-2 bg-shade-1-100% border-2 border-secondary-700 hover:bg-secondary-700 hover:text-shade-1-100% hover:cursor-pointer"
                              key={index}
                              onClick={() => {
                                setIsDialogOpen(true);
                                setSelectedSchedule(schedule);
                              }}
                            >
                              <Typography
                                headingElement="h5"
                                headingStyle={"p"}
                                className=""
                              >
                                {` ${moment(schedule?.openingTime).format(
                                  "hh:mm a"
                                )} - ${moment(schedule?.closingTime).format(
                                  "hh:mm a"
                                )}`}
                              </Typography>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        )}
      </div>

      <AppointmentConfirmDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        appointmentDate={selectedDay}
        schedule={selectedSchedule}
      />
    </section>
  );
}
