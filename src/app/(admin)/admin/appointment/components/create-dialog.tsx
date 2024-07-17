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
import { createAppointment } from "@/lib/api/appointmentAPI"; // Update with appointment API functions
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";

import { MyInputSelect, MyPriceInput } from "@/components/myinput";
import _ from "lodash";
import { DentistModel, getDentistList } from "@/lib/api/dentistAPI";
import { getServiceList, ServiceModel } from "@/lib/api/serviceAPI";
import { getScheduleList, ScheduleModel } from "@/lib/api/scheduleAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";
import { fetchCustomerList } from "@/lib/api/customerAPI";
import { LoaderCircle } from "lucide-react";

const dayArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const appointmentFormSchema = z.object({
  clinicID: z.number(),
  dentistID: z.number(),
  serviceID: z.number(),
  scheduleID: z.number(),
  customerID: z.number(),
  appointmentDate: z.string().min(1, { message: "Date is required" }),
  appointmentTime: z.string().min(1, { message: "Time is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

export default function AppointmentAddDialog({
  title = "Create Appointment",
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
    clinicID: number;
    customerID: number;
    dentistID: number;
    serviceID: number;
    scheduleID: number;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [clinics, setClinics] = useState<ClinicModel[]>([]);
  const [dentists, setDentists] = useState<DentistModel[]>([]);
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();
  const [selectedDentist, setSelectedDentist] = useState<DentistModel>();
  const [selectedService, setSelectedService] = useState<ServiceModel>();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleModel>();
  const [selectedCustomer, setSelectedCustomer] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>();

  const [dialogOpen, setDialogOpen] = useState(open);

  const setDialogOpenState = (state: boolean) => {
    setDialogOpen(state);
    onOpenChange?.(state);
  };

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clinicID: defaultValues?.clinicID || 0,
      dentistID: defaultValues?.dentistID || 0,
      serviceID: defaultValues?.serviceID || 0,
      scheduleID: defaultValues?.scheduleID || 0,
      appointmentDate: defaultValues?.appointmentDate || "",
      appointmentTime: defaultValues?.appointmentTime || "",
      status: defaultValues?.status || "Scheduled",
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created successfully!");
      setDialogOpenState(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  const {
    data: clinicData,
    isLoading: isLoadingClinics,
    error: clinicError,
    isError: isErrorClinics,
    isSuccess: isSuccessClinics,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  const {
    data: dentistData,
    isLoading: isLoadingDentists,
    error: dentistError,
    isError: isErrorDentists,
    isSuccess: isSuccessDentists,
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: getDentistList,
  });

  const {
    data: serviceData,
    isLoading: isLoadingServices,
    error: serviceError,
    isError: isErrorServices,
    isSuccess: isSuccessServices,
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServiceList,
  });

  const {
    data: scheduleData,
    isLoading: isLoadingSchedules,
    error: scheduleError,
    isError: isErrorSchedules,
    isSuccess: isSuccessSchedules,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getScheduleList,
  });

  const {
    data: customerData,
    isLoading: isCustomerLoading,
    isSuccess: isCustomerSuccess,
    error: customerError,
    isError: isErrorCustomer,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomerList,
  });

  useEffect(() => {
    if (isCustomerSuccess && customerData) {
      setCustomers(customerData.data);
    }
  }, [isCustomerSuccess]);

  useEffect(() => {
    if (isSuccessClinics && clinicData) {
      setClinics(clinicData.data);
    }
  }, [isSuccessClinics]);

  useEffect(() => {
    if (isSuccessDentists && dentistData) {
      setDentists(dentistData.data);
    }
  }, [isSuccessDentists]);

  useEffect(() => {
    if (isSuccessServices && serviceData) {
      setServices(serviceData.data);
    }
  }, [isSuccessServices]);

  useEffect(() => {
    if (isSuccessSchedules && scheduleData) {
      setSchedules(scheduleData.data);
    }
  }, [isSuccessSchedules]);

  useErrorNotification({
    isError:
      isErrorClinics ||
      isErrorDentists ||
      isErrorServices ||
      isErrorSchedules ||
      isErrorCustomer,
    title:
      clinicError?.message ||
      dentistError?.message ||
      serviceError?.message ||
      customerError?.message ||
      scheduleError?.message,
  });

  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    mutate({
      clinicID: values.clinicID,
      clinicScheduleID: values.scheduleID,
      customerID: values.customerID,
      dentistID: values.dentistID,
      serviceID: values.serviceID,
      appointmentDate: values.appointmentDate,
      appointmentTime: moment(
        `1970-01-01T${values.appointmentTime}:00.000Z`
      ).toISOString(),
      status: values.status,
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
                {customers.length > 0 && (
                  <FormField
                    control={form.control}
                    name="customerID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "customerID",
                            value: selectedCustomer?.customerID,
                            valueDisplay: selectedCustomer?.name,
                            placeholderText: "Select Customer",
                            label: "Customer",
                            items: customers.map((c) => ({
                              value: c.customerID,
                              text: c.name,
                            })),
                          }}
                          updateFormData={({ path, value }: any) => {
                            form.setValue("customerID", value);
                            setSelectedCustomer(
                              customers.find((c) => c.customerID === value)
                            );
                          }}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {clinics.length > 0 && (
                  <FormField
                    control={form.control}
                    name="clinicID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "clinicID",
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
                            form.setValue("clinicID", value);
                            setSelectedClinic(
                              clinics.find(
                                (clinic) => clinic.clinicID === value
                              )
                            );
                            setSelectedDentist(undefined);
                            setSelectedService(undefined);
                            setSelectedSchedule(undefined);
                          }}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {dentists.length > 0 && (
                  <FormField
                    control={form.control}
                    name="dentistID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "dentistID",
                            value: selectedDentist?.dentistId,
                            valueDisplay: selectedDentist?.name,
                            placeholderText: "Select Dentist",
                            label: "Dentist",
                            items: dentists
                              .filter(
                                (d) =>
                                  _.parseInt(
                                    selectedClinic?.clinicID || "0"
                                  ) === d.clinicID
                              )
                              .map((dentist) => ({
                                value: dentist.dentistId,
                                text: dentist.name,
                              })),
                          }}
                          updateFormData={({ path, value }: any) => {
                            form.setValue("dentistID", value);
                            setSelectedDentist(
                              dentists.find(
                                (dentist) => dentist.dentistId === value
                              )
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {services.length > 0 && (
                  <FormField
                    control={form.control}
                    name="serviceID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "serviceID",
                            value: selectedService?.serviceID,
                            valueDisplay: selectedService?.name,
                            placeholderText: "Select Service",
                            label: "Service",
                            items: services
                              .filter((s) => {
                                // console.log(
                                //   s.clinicID,
                                //   selectedClinic?.clinicID,
                                //   s.clinicID ===
                                //     (selectedClinic?.clinicID || "0")
                                // );
                                return (
                                  s.clinicID ===
                                  (selectedClinic?.clinicID || "0")
                                );
                              })
                              .map((service) => ({
                                value: service.serviceID,
                                text: service.name,
                              })),
                          }}
                          updateFormData={({ path, value }: any) => {
                            form.setValue("serviceID", value);
                            setSelectedService(
                              services.find(
                                (service) => service.serviceID === value
                              )
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Date</FormLabel>
                      <Input
                        {...field}
                        value={selectedDate}
                        type="date"
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedSchedule(undefined);
                          form.setValue("appointmentDate", e.target.value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {schedules.length > 0 && (
                  <FormField
                    control={form.control}
                    name="scheduleID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <MyInputSelect
                          props={{
                            path: "scheduleID",
                            value: selectedSchedule?.scheduleID,
                            valueDisplay: selectedSchedule
                              ? `${selectedSchedule?.dayOfWeek} - ${moment(
                                  selectedSchedule?.openingTime
                                ).format("HH:mm")} - ${moment(
                                  selectedSchedule?.closingTime
                                ).format("HH:mm")}`
                              : "Select Schedule",
                            placeholderText: "Select Schedule",
                            label: "Schedule",
                            items: schedules
                              .filter((sche) => {
                                console.log(
                                  sche.clinicID,
                                  selectedClinic?.clinicID
                                );
                                return (
                                  sche.clinicID ===
                                  _.parseInt(selectedClinic?.clinicID || "0")
                                );
                              })
                              .filter((sche) => {
                                return (
                                  sche.dayOfWeek ===
                                  dayArray[moment(selectedDate).day()]
                                );
                              })
                              .map((schedule) => ({
                                value: schedule.scheduleID,
                                text: `${schedule?.dayOfWeek} - ${moment(
                                  schedule?.openingTime
                                ).format("HH:mm")} - ${moment(
                                  schedule?.closingTime
                                ).format("HH:mm")}`,
                              })),
                          }}
                          updateFormData={({ path, value }: any) => {
                            form.setValue("scheduleID", value);
                            setSelectedSchedule(
                              schedules.find(
                                (schedule) => schedule.scheduleID === value
                              )
                            );
                            form.setValue(
                              "appointmentTime",
                              moment(
                                schedules.find(
                                  (schedule) => schedule.scheduleID === value
                                )?.openingTime
                              ).format("HH:mm")
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Time</FormLabel>
                      <Input {...field} type="time" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("status", value)
                        }
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { text: "Scheduled", value: "Scheduled" },
                            { text: "Completed", value: "Paid" },
                            { text: "Cancelled", value: "Cancelled" },
                          ].map(({ text, value }) => (
                            <SelectItem key={value} value={value}>
                              {text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                <Button
                  type="submit"
                  variant={"outline"}
                  disabled={status === "pending"}
                >
                  {status === "pending" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    buttonTitle
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
