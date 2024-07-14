import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { createClinicSchedule } from "@/lib/api/clinicScheduleAPI"; // Update with clinic schedule API functions
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";
import { MyInputSelect } from "@/components/myinput";
import moment, { duration } from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import _ from "lodash";

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

export default function ClinicScheduleAddDialog({
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
    clinicId: number;
    dayOfWeek: string;
    slotDuration: number;
    openingTime: string;
    closingTime: string;
    maxPatientsPerSlot: number;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const times: string[] = [];
  const startTime = moment("00:00", "HH:mm");
  const endTime = moment("24:00", "HH:mm");

  while (startTime.isSameOrBefore(endTime)) {
    times.push(startTime.format("HH:mm"));
    startTime.add(30, "minutes");
  }

  const [openingTime, setOpeningTime] = useState<any>();
  const [closingTime, setClosingTime] = useState<any>();

  const [dialogOpen, setDialogOpen] = useState(open);

  const setDialogOpenState = (state: boolean) => {
    setDialogOpen(state);
    onOpenChange?.(state);
  };

  const form = useForm<z.infer<typeof clinicScheduleFormSchema>>({
    resolver: zodResolver(clinicScheduleFormSchema),
    defaultValues: {
      clinicId: defaultValues?.clinicId || 0,
      dayOfWeek: defaultValues?.dayOfWeek || "",
      slotDuration: defaultValues?.slotDuration || 60,
      openingTime: defaultValues?.openingTime || "",
      closingTime: defaultValues?.closingTime || "",
      maxPatientsPerSlot: defaultValues?.maxPatientsPerSlot || 1,
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createClinicSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicSchedules"] });
      toast.success("Clinic Schedule created successfully!");
      setDialogOpenState(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  // const {
  //   data: clinicData,
  //   isLoading: isLoadingClinics,
  //   error: clinicError,
  //   isError: isErrorClinics,
  //   isSuccess: isSuccessClinics,
  // } = useQuery({
  //   queryKey: ["clinics"],
  //   queryFn: fetchClinicList,
  // });

  // useEffect(() => {
  //   if (isSuccessClinics && clinicData) {
  //     setClinics(clinicData.data);
  //     if (defaultValues?.clinicId) {
  //       setSelectedClinic(
  //         clinicData.data.find(
  //           (clinic: ClinicModel) =>
  //             clinic.clinicID === (defaultValues?.clinicId ?? 0).toString()
  //         )
  //       );
  //     }
  //   }
  // }, [isSuccessClinics]);

  // useErrorNotification({
  //   isError: isErrorClinics,
  //   title: clinicError?.message,
  // });

  async function onSubmit(values: z.infer<typeof clinicScheduleFormSchema>) {
    mutate({
      clinicId: defaultValues?.clinicId.toString() ?? "",
      dayOfWeek: values.dayOfWeek,
      slotDuration: values.slotDuration,
      openingTime: moment(values.openingTime, "HH:mm").toISOString(),
      closingTime: moment(values.closingTime, "HH:mm").toISOString(),
      maxPatientsPerSlot: values.maxPatientsPerSlot,
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpenState}>
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pt-4"
            >
              <div className="flex flex-col gap-2">
                {/* {clinics.length > 0 && (
                  <FormField
                    control={form.control}
                    name="clinicId"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "clinicId",
                            value: selectedClinic?.clinicID,
                            valueDisplay: selectedClinic?.name,
                            placeholderText: "Select Clinic",
                            label: "Clinic",
                            items: clinics.map((clinic) => ({
                              value: clinic.clinicID,
                              text: clinic.name,
                            })),
                          }}
                          updateFormData={({ path, value }: any) => {
                            form.setValue("clinicId", value);
                            setSelectedClinic(
                              clinics.find(
                                (clinic) => clinic.clinicID === value
                              )
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )} */}
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
                        onValueChange={(value) =>
                          form.setValue("slotDuration", _.parseInt(value))
                        }
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
                        type="number"
                        onChange={(e) =>
                          form.setValue(
                            "maxPatientsPerSlot",
                            _.parseInt(e.target.value)
                          )
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setDialogOpenState(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant={"outline"}>
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
