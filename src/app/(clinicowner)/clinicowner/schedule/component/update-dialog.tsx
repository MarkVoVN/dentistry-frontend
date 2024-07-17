import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { updateClinicSchedule } from "@/lib/api/clinicScheduleAPI"; // Update with clinic schedule API functions
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import moment from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { DeleteAlert } from "./delete-alert";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const clinicScheduleFormSchema = z.object({
  clinicId: z.number(),
  dayOfWeek: z.string().min(1, { message: "Day of Week is required" }),
  slotDuration: z.number().min(1, { message: "Slot Duration is required" }),
  openingTime: z.string().min(1, { message: "Opening Time is required" }),
  closingTime: z.string().min(1, { message: "Closing Time is required" }),
  maxPatientsPerSlot: z
    .number()
    .min(1, { message: "Max Patients Per Slot is required" }),
});

export default function ClinicScheduleUpdateDialog({
  title = "Create Clinic Schedule",
  buttonTitle = "Add",
  description,
  defaultValues,
  submitFunction,
  open,
  onOpenChange,
  onSuccess,
  onFail,
  hideTrigger = false,
}: {
  title?: string;
  description?: string;
  buttonTitle?: string;
  defaultValues?: {
    scheduleId: string;
    clinicId: number;
    dayOfWeek: string;
    slotDuration: number;
    openingTime: string;
    closingTime: string;
    maxPatientsPerSlot: number;
  };
  submitFunction: any;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const times: string[] = [];
  const startTime = moment("00:00", "HH:mm");
  const endTime = moment("23:30", "HH:mm");

  while (startTime.isSameOrBefore(endTime)) {
    times.push(startTime.format("HH:mm"));
    startTime.add(30, "minutes");
  }

  const [openingTime, setOpeningTime] = useState<any>(
    moment(defaultValues?.openingTime).format("HH:mm")
  );
  const [closingTime, setClosingTime] = useState<any>(
    moment(defaultValues?.closingTime).format("HH:mm")
  );

  const form = useForm<z.infer<typeof clinicScheduleFormSchema>>({
    resolver: zodResolver(clinicScheduleFormSchema),
    defaultValues: {
      clinicId: defaultValues?.clinicId || 0,
      dayOfWeek: defaultValues?.dayOfWeek || "",
      slotDuration: defaultValues?.slotDuration || 60,
      openingTime: moment(defaultValues?.openingTime).format("HH:mm"),
      closingTime: moment(defaultValues?.closingTime).format("HH:mm"),
      maxPatientsPerSlot: defaultValues?.maxPatientsPerSlot || 1,
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateClinicSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicSchedules"] });

      toast.success("Clinic Schedule created successfully!");
      onOpenChange(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof clinicScheduleFormSchema>) {
    mutate({
      scheduleID: defaultValues?.scheduleId ?? "",
      clinicId: values.clinicId.toString() ?? "",
      dayOfWeek: values.dayOfWeek,
      slotDuration: values.slotDuration,
      openingTime: moment(`1970-01-01T${openingTime}:00.000Z`).toISOString(),
      closingTime: moment(`1970-01-01T${closingTime}:00.000Z`).toISOString(),
      maxPatientsPerSlot: values.maxPatientsPerSlot,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">{buttonTitle}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90%] overflow-y-scroll lg:overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="gap-4 py-2">
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pt-4"
            >
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Day of Week</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("dayOfWeek", value)
                        }
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Day of Week" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Slot Duration (minutes)</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          form.setValue("slotDuration", _.parseInt(value));

                          setClosingTime(
                            moment(form.getValues("openingTime"), "HH:mm")
                              .add(_.parseInt(value), "minutes")
                              .format("HH:mm")
                          );
                          form.setValue(
                            "closingTime",
                            moment(form.getValues("openingTime"), "HH:mm")
                              .add(_.parseInt(value), "minutes")
                              .format("HH:mm")
                          );
                        }}
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {[30, 60, 90].map((duration) => (
                            <SelectItem
                              key={duration}
                              value={duration.toString()}
                            >
                              {`${duration} minutes`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Opening Time</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          form.setValue("openingTime", value);
                          setOpeningTime(value);
                          setClosingTime(
                            moment(value, "HH:mm")
                              .add(form.getValues("slotDuration"), "minutes")
                              .format("HH:mm")
                          );
                          form.setValue(
                            "closingTime",
                            moment(value, "HH:mm")
                              .add(form.getValues("slotDuration"), "minutes")
                              .format("HH:mm")
                          );
                        }}
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Opening Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((time) => (
                            <SelectItem key={time} value={time}>
                              {`${time}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Closing Time</FormLabel>
                      <Input {...field} value={closingTime} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPatientsPerSlot"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Max Patients Per Slot</FormLabel>
                      <Input
                        {...field}
                        min={1}
                        type="number"
                        onChange={(e) => {
                          try {
                            form.setValue(
                              "maxPatientsPerSlot",
                              _.parseInt(e.target.value)
                            );
                          } catch (error) {
                            form.setValue("maxPatientsPerSlot", 1);
                          }
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DeleteAlert
                  id={defaultValues?.scheduleId ?? ""}
                  onSuccess={() => onOpenChange(false)}
                />
                <Button type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(form.getValues());
                  }}
                >
                  {buttonTitle}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
