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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import "react-time-picker/dist/TimePicker.css";
import {
  ClinicModel,
  fetchClinicList,
  updateClinic,
} from "@/lib/api/clinicAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MyInputSelect, MyPriceInput } from "@/components/myinput";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";
import { updateAppointment } from "@/lib/api/appointmentAPI";

const appointmentFormSchema = z.object({
  clinicID: z.number().min(1, {
    message: "Chọn phòng khám",
  }),
  clinicScheduleID: z.number().optional(), 
  customerID: z.number().optional(), 
  dentistID: z.number().optional(), 
  serviceID: z.number().optional(), 
  appointmentDate: z.string().optional(), 
  appointmentTime: z.string().optional(), 
  status: z.string().optional(), 
});


export default function AppointmentUpdateDialog({
  title = "Title",
  buttonTitle = "Add",
  description,
  defaultValues,
  submitFunction,
  isOpen,
  setIsOpen,
  onSuccess,
  onFail,
  hideTrigger = false,
}: {
  title?: string;
  description?: string;
  buttonTitle?: string;
  defaultValues?: {
    id?: string; 
    clinicID: number; 
    clinicScheduleID?: number; 
    customerID?: number; 
    dentistID?: number; 
    serviceID?: number; 
    appointmentDate?: string; 
    appointmentTime?: string; 
    status?: string; 
  };
  
  submitFunction: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [clinics, setClinics] = useState<ClinicModel[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clinicID: defaultValues?.clinicID || 0, 
      clinicScheduleID: defaultValues?.clinicScheduleID || 0,
      customerID: defaultValues?.customerID || 0, 
      dentistID: defaultValues?.dentistID || 0, 
      serviceID: defaultValues?.serviceID || 0, 
      appointmentDate: defaultValues?.appointmentDate || "", 
      appointmentTime: defaultValues?.appointmentTime || "", 
      status: defaultValues?.status || "", 
    },
  });

  // const watchFields = form.watch(["name", "description", "duration", "price"]);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cập nhật appointment " + variables.appointmentID + " thành công!");
      setIsOpen(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data, pagination } = req_data;
      setClinics(data);
      setSelectedClinic(
        data.find((clinic: any) => clinic.clinicID === defaultValues?.clinicID)
      );
    }
  }, [isSuccess]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  

  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    mutate({
      appointmentID: _.parseInt(defaultValues?.id ?? '0'),
      clinicID: values.clinicID,
      clinicScheduleID: values?.clinicScheduleID ?? 0 , 
      customerID: values.customerID ?? 0,
      dentistID: values.dentistID ?? 0,
      serviceID: values.serviceID ?? 0,
      appointmentDate: values.appointmentDate || '', // Provide a default empty string or handle appropriately
      appointmentTime: values.appointmentTime || '', // Provide a default empty string or handle appropriately
      status: values.status || '', // Provide a default empty string or handle appropriately
    });
  }
  
  
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className=" max-h-[90%] overflow-y-scroll lg:overflow-auto">
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
              <div className="flex flex-col gap-4">
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
                          items: clinics?.map((clinic: any) => ({
                            value: clinic.clinicID,
                            text: clinic.name,
                          })),
                        }}
                        updateFormData={({
                          path,
                          value,
                        }: {
                          path: string;
                          value: any;
                        }) => {
                          form.setValue("clinicID", value);
                          setSelectedClinic(
                            clinics.find((clinic) => clinic.clinicID === value)
                          );
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Tên dịch vụ</FormLabel>
                      <Input placeholder="Appointment Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}


                <FormField
                  control={form.control}
                  name="clinicID"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      {/* <FormLabel>Clinic</FormLabel> */}
                      <MyInputSelect
                        props={{
                          defaultValue: defaultValues?.clinicID,
                          path: "clinicID",
                          value: selectedClinic?.clinicID,
                          valueDisplay: selectedClinic?.name,
                          placeholderText: "Select Clinic",
                          label: "Clinic",
                          items: clinics?.map((clinic: any) => ({
                            value: clinic.clinicID,
                            text: clinic.name,
                          })),
                        }}
                        updateFormData={({
                          path,
                          value,
                        }: {
                          path: string;
                          value: any;
                        }) => {
                          form.setValue("clinicID", value);
                          setSelectedClinic(
                            clinics.find((clinic) => clinic.clinicID === value)
                          );
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Thêm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
