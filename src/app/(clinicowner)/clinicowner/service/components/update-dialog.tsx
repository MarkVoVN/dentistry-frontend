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
import { updateService } from "@/lib/api/serviceAPI";
import { MyInputSelect, MyPriceInput } from "@/components/myinput";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";

const serviceFormSchema = z.object({
  clinicID: z.string().min(1, {
    message: "Chọn phòng khám",
  }),
  name: z.string().min(2, {
    message: "Tên dịch vụ phải có ít nhất 2 ký tự",
  }),
  description: z.string().min(5, {
    message: "Mô tả phải có ít nhất 5 ký tự",
  }),
  duration: z.string().min(1, {
    message: "Thời gian dịch vụ phải lớn hơn 0",
  }),
  price: z.number().min(1, {
    message: "Giá dịch vụ phải lớn hơn 0",
  }),
});

export default function ServiceUpdateDialog({
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
    id: string;
    clinicID: string;
    name: string;
    description: string;
    duration: number;
    price: number;
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

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      clinicID: defaultValues?.clinicID.toString() || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      duration: (defaultValues?.duration || 30).toString(),
      price: defaultValues?.price || 100000,
    },
  });

  const watchFields = form.watch(["name", "description", "duration", "price"]);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateService,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Cập nhật dịch vụ " + variables.name + " thành công!");
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

  async function onSubmit(values: z.infer<typeof serviceFormSchema>) {
    mutate({
      serviceID: defaultValues?.id || "",
      name: values.name,
      description: values.description,
      duration: _.parseInt(values.duration),
      price: values.price,
      clinicID: values.clinicID || "",
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
                          readonly: true,
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Tên dịch vụ</FormLabel>
                      <Input placeholder="Service Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Mô tả</FormLabel>
                      <Textarea placeholder="Description" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Thời gian (phút)</FormLabel>
                      <Input type="number" placeholder="Duration" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Giá</FormLabel>
                      <MyPriceInput
                        min={0}
                        max={1000000000}
                        defaultValue={0}
                        value={field.value}
                        setValue={(value) => form.setValue("price", value)}
                      ></MyPriceInput>
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
