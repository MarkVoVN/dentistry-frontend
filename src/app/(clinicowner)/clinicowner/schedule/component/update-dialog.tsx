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
import "react-time-picker/dist/TimePicker.css";
import { updateClinicSchedule } from "@/lib/api/clinicScheduleAPI";
import { useState } from "react";
// import { DeleteAlert } from "./delete-alert";

const formSchema = z.object({
  clinicId: z.string(),
  dayOfWeek: z.string(),
  slotDuration: z.string(),
  openingHours: z.string(),
  closingHours: z.string(),
  maxPatientsPerSlot: z.number(),
});

export default function ClinicUpdateDialog({
  title = "Title",
  description,
  defaultValues,
  submitFunction,
  isOpen,
  setIsOpen,
}: {
  title?: string;
  description?: string;
  defaultValues?: {
    scheduleId: string;
    clinicId: string;
    dayOfWeek: string;
    slotDuration: string;
    openingHours: string;
    closingHours: string;
    maxPatientsPerSlot: number;
  };
  submitFunction: any;
  isOpen: boolean;
  setIsOpen: any;
}) {
  const [isAlertDelOpen, setIsAlertDelOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotDuration: defaultValues?.slotDuration || "",
      maxPatientsPerSlot: defaultValues?.maxPatientsPerSlot || 0,
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
      queryClient.invalidateQueries({ queryKey: ["clinicSchedule"] });
      toast.success("Sửa lịch thành công!");

      setIsOpen(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      clinicId: values.clinicId,
      dayOfWeek: values.dayOfWeek,
      openingHours: values.openingHours,
      closingHours: values.closingHours,
      slotDuration: values.slotDuration || "",
      maxPatientsPerSlot: values.maxPatientsPerSlot || 0,
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
                    name="slotDuration"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Thời gian cho slot</FormLabel>
                        <FormControl>
                          <Input placeholder="Slot Duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxPatientsPerSlot"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Số lượng người</FormLabel>
                        <FormControl>
                          <Input placeholder="Max Patient" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
              <Button
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Xóa
                </Button>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
          {/* <DeleteAlert item={undefined}/> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
