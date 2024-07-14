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

import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClinicScheduleModel,
  deleteClinicSchedule,
} from "@/lib/api/clinicScheduleAPI";

export function DeleteAlert({
  // open,
  // setOpen,
  id,
  // children,
  onSuccess,
}: {
  // open: boolean;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
  // children: React.ReactNode;
  onSuccess?: any;
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
      onSuccess();
      // setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    mutate(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>
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
