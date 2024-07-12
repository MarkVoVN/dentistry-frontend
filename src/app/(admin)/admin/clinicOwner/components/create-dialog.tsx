"use client";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import toast from "react-hot-toast";
import { createClinicOwner } from "@/lib/api/clinicOwnerAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import "react-time-picker/dist/TimePicker.css";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";
import { MyInputSelect } from "@/components/myinput";

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
  clinicID: z.number(),
  status: z.boolean().optional(),
});

export default function ClinicOwnerAddDialog({
  title = "Title",
  buttonTitle = "Add",
  description,
  defaultValues,
  submitFunction,
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  title?: string;
  description?: string;
  buttonTitle?: string;
  defaultValues?: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    clinicId: string;
    status: boolean;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  hideTrigger?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(open);
  const [clinicList, setClinicList] = useState<ClinicModel[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();

  const setDialogOpenState = (state: boolean) => {
    setDialogOpen(state);
    onOpenChange?.(state);
  };

  const {data: clinics, isLoading, error, isError, isSuccess} = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (isSuccess && clinics) {
      const { data, pagination } = clinics;
      setClinicList(data);
    }
  }, [isSuccess]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      status: defaultValues?.status || true,
    },
  });

  //watch
  const watchFields = form.watch([
    "name",
    "phoneNumber",
    "email",
  ]);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createClinicOwner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicOwners"] });
      toast.success("Tạo nhân viên " + variables.name + " thành công!");

      setDialogOpenState(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    mutate({
      name: values.name || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      status: values.status || false,
      clinicID: (values.clinicID || 0).toString(),
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpenState}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">{buttonTitle}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="lg:min-w-[50%] lg:left-[350px] lg:translate-x-[0%] max-h-[90%] overflow-y-scroll lg:overflow-auto">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div id="left">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Tên nhân viên</FormLabel>
                        <FormControl>
                          <Input placeholder="Clinic Owner Name" {...field} />
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
                </div>
                <div>
                  {/* TODO: select clinic */}
                  <FormField
                    control={form.control}
                    name="clinicID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        {/* <FormLabel>Clinic</FormLabel> */}
                        <MyInputSelect
                          props={{
                            path: "clinicID",
                            value: selectedClinic?.clinicID,
                            valueDisplay: selectedClinic?.name,
                            placeholderText: "Select Clinic",
                            label: "Clinic",
                            items: clinicList?.map((clinic: any) => ({
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
                              clinicList.find((clinic) => clinic.clinicID === value)
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
