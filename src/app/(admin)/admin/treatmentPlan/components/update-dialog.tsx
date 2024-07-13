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
import {
  createTreatmentPlan,
  updateTreatmentPlan,
} from "@/lib/api/treatmentPlanAPI"; // Update with treatment plan API functions
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { DentistModel, getDentistList } from "@/lib/api/dentistAPI";
import { fetchCustomerList } from "@/lib/api/customerAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import _, { values } from "lodash";
import { text } from "stream/consumers";
import moment from "moment";

const treatmentPlanFormSchema = z.object({
  customerID: z.number(),
  dentistID: z.number(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().min(5, {
    message: "Mô tả phải có ít nhất 5 ký tự",
  }),
  nextAppointmentDate: z.string().optional(),
  status: z.string().min(0, {
    message: "Status is required",
  }),
  paymentStatus: z.string().min(1, {
    message: "Payment status is required",
  }),
});

export default function TreatmentPlanAddDialog({
  title = "Add Treatment Plan",
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
    planID: number;
    customerID: number;
    dentistID: number;
    startDate: string;
    endDate?: string;
    description: string;
    nextAppointmentDate?: string;
    status: string;
    paymentStatus: string;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [customers, setCustomers] = useState([]);
  const [dentists, setDentists] = useState<DentistModel[]>([]);

  const form = useForm<z.infer<typeof treatmentPlanFormSchema>>({
    resolver: zodResolver(treatmentPlanFormSchema),
    defaultValues: {
      customerID: defaultValues?.customerID,
      dentistID: defaultValues?.dentistID,
      startDate: defaultValues?.startDate || moment().format("YYYY-MM-DD"),
      endDate: defaultValues?.endDate,
      description: defaultValues?.description || "",
      nextAppointmentDate: defaultValues?.nextAppointmentDate,
      status: defaultValues?.status || "In Progress",
      paymentStatus: defaultValues?.paymentStatus || "Unpaid",
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateTreatmentPlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
      toast.success("Created treatment plan successfully!");
      onOpenChange(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  const {
    data: customerData,
    isLoading: isCustomerLoading,
    isSuccess: isCustomerSuccess,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomerList,
  });

  const {
    data: dentistData,
    isLoading: isDentistLoading,
    isSuccess: isDentistSuccess,
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: getDentistList,
  });

  useEffect(() => {
    if (isCustomerSuccess && customerData) {
      setCustomers(customerData.data);
    }
  }, [isCustomerSuccess]);

  useEffect(() => {
    if (isDentistSuccess && dentistData) {
      setDentists(dentistData.data);
    }
  }, [isDentistSuccess]);

  async function onSubmit(values: z.infer<typeof treatmentPlanFormSchema>) {
    mutate({
      planID: defaultValues?.planID || 0,
      customerID: values.customerID,
      dentistID: values.dentistID,
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: values?.endDate
        ? moment(values.endDate).format("YYYY-MM-DD")
        : undefined,
      description: values.description,
      nextAppointmentDate: values.nextAppointmentDate
        ? moment(values.nextAppointmentDate).format("YYYY-MM-DD")
        : undefined,
      status: values.status,
      paymentStatus: values.paymentStatus,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90%] min-w-[50vw] overflow-y-scroll lg:overflow-auto">
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
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  {customers?.length > 0 && (
                    <FormField
                      control={form.control}
                      name="customerID"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Customer</FormLabel>

                          <Select
                            onValueChange={(value) =>
                              form.setValue("customerID", Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map((customer: any) => (
                                <SelectItem
                                  key={customer.customerID}
                                  value={customer.customerID.toString()}
                                >
                                  {customer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <FormLabel>Dentist</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("dentistID", Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Dentist" />
                            </SelectTrigger>
                            <SelectContent>
                              {dentists.map((dentist: DentistModel) => (
                                <SelectItem
                                  key={dentist.dentistId}
                                  value={dentist.dentistId.toString()}
                                >
                                  {dentist.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { text: "In Progress", value: "In Progress" },
                              { text: "Completed", value: "Completed" },
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
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Payment Status</FormLabel>
                        {/* <Input placeholder="Payment Status" {...field} /> */}
                        <Select
                          onValueChange={(value) =>
                            form.setValue("paymentStatus", value)
                          }
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { text: "Unpaid", value: "Unpaid" },
                              { text: "Paid", value: "Paid" },
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
                <div className="flex flex-col gap-2 w-1/2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Start Date</FormLabel>
                        <Input type="date" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>End Date</FormLabel>
                        <Input type="date" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextAppointmentDate"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Next Appointment Date</FormLabel>
                        <Input type="date" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Description</FormLabel>
                    <Textarea placeholder="Description" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
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
