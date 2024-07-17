"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { updateClinicOwner } from "@/lib/api/clinicOwnerAPI";
import { MyInputSelect } from "@/components/myinput";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";
import { useEffect, useState } from "react";
import PasswordResetDialog from "@/components/resetPasswordDialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên nhân viên phải có ít nhất 2 ký tự",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  clinicId: z.string().optional(),
  status: z.boolean().optional(),
});

export default function ClinicOwnerUpdateSection({
  title = "Title",
  description,
  defaultValues,
  isOpen,
  setIsOpen,
}: {
  title?: string;
  description?: string;
  defaultValues?: {
    ownerID: number;
    name: string;
    phoneNumber: string;
    email: string;
    clinicId: string;
    status: boolean;
  };
  submitFunction: any;
  isOpen: boolean;
  setIsOpen: any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      clinicId: (defaultValues?.clinicId || "").toString(),
      status: defaultValues?.status || true,
    },
  });

  const [clinicList, setClinicList] = useState<ClinicModel[]>([]);

  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();

  const {
    data: clinics,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (isSuccess && clinics) {
      const { data, pagination } = clinics;
      setClinicList(data);

      const selClinic =
        data.find(
          (clinic: ClinicModel) => clinic.clinicID === defaultValues?.clinicId
        ) ?? data[0];
      setSelectedClinic(selClinic);
    }
  }, [isSuccess]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateClinicOwner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicOwners"] });

      toast.success(
        "Sửa thông tin nhân viên " + variables.name + " thành công!"
      );
      setIsOpen(false);
      onSubmit(variables);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      ownerID: defaultValues?.ownerID,
      name: values.name || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      status: values.status || false,
      clinicID: values.clinicId || "",
    });
  }

  return (
    <div className="gap-4 py-2 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Tên nhân viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Clinic Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicId"
              render={({ field }) => (
                <FormItem className="mt-4">
                  {/* <FormLabel>Clinic</FormLabel> */}
                  <MyInputSelect
                    props={{
                      path: "clinicId",
                      value: selectedClinic?.clinicID,
                      valueDisplay: selectedClinic?.name,
                      placeholderText: "Select Clinic",
                      label: "Clinic",
                      items: clinicList?.map((clinic: any) => ({
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
                      form.setValue("clinicId", value.toString());
                      setSelectedClinic(
                        clinicList.find((clinic) => clinic.clinicID === value)
                      );
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
