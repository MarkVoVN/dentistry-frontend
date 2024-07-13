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
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import "react-time-picker/dist/TimePicker.css";
import { createClinicSchedule } from "@/lib/api/clinicScheduleAPI";

const formSchema = z.object({
  clinicId: z.string(),
  dayOfWeek: z.string(),
  slotDuration: z.string(),
  openingHours: z.string(),
  closingHours: z.string(),
  maxPatientsPerSlot: z.number(),
});

export default function ClinicAddDialog({
  title = "Title",
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
    clinicId: string;
    dayOfWeek: string;
    slotDuration: string;
    openingHours: string;
    closingHours: string;
    maxPatientsPerSlot: number;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(open);

  const setDialogOpenState = (state: boolean) => {
    setDialogOpen(state);
    onOpenChange?.(state);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotDuration: defaultValues?.slotDuration || "",
      maxPatientsPerSlot: defaultValues?.maxPatientsPerSlot || 0,
    },
  });

  //watch
  const watchFields = form.watch([
    "slotDuration",
    "maxPatientsPerSlot",
  ]);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createClinicSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicSchedule"] });
      toast.success("Tạo lịch " + " thành công!");

      setDialogOpenState(false);
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
