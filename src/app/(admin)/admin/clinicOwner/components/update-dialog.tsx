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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { updateClinicOwner } from "@/lib/api/clinicOwnerAPI";

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

export default function ClinicOwnerUpdateDialog({
  title = "Title",
  description,
  defaultValues,
  isOpen,
  setIsOpen,
}: {
  title?: string;
  description?: string;
  defaultValues?: {
    id: string;
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
      clinicId: defaultValues?.clinicId || "",
      status: defaultValues?.status || true,
    },
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

      toast.success("Sửa thông tin nhân viên " + variables.name + " thành công!");
      setIsOpen(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      name: values.name || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      status: values.status || false,
      clinicID: values.clinicId || "",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="lg:min-w-[50%] lg:left-[350px] lg:translate-x-[0%] max-h-[70%] overflow-y-scroll lg:overflow-auto p-0">
        <DialogHeader className="bg-shade-1-100% sticky -top-1 z-[20] py-4 px-4 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
          <Close className=" rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 z-[40]" />
            <span className="sr-only">Close</span>
          </Close>
        </DialogHeader>
        <div className="gap-4 py-2 p-4">
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
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
