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

import { DialogClose } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClinicScheduleModel, deleteClinicSchedule } from "@/lib/api/clinicScheduleAPI";

export function DeleteAlert({
  open, setOpen, item
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: ClinicScheduleModel;
}) {
  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: deleteClinicSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinicSchedules"] });
      toast.success("Xóa lịch thành công!");

      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    mutate(item.scheduleId? item.scheduleId : '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          schedule and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <Button variant="destructive" onClick={handleDelete}>
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}
