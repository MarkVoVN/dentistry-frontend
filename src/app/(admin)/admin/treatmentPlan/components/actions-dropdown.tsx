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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DialogClose } from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  TreatmentPlanModel,
  deleteTreatmentPlan,
} from "@/lib/api/treatmentPlanAPI"; // Update with your API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TreatmentPlanUpdateDialog from "./update-dialog";

export function ActionsDropdown({
  row,
}: {
  row: Row<
    TreatmentPlanModel & {
      id: string;
    }
  >;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const defaultValues = {
    planID: row?.original?.planID,
    customerID: row.original.customerID,
    dentistID: row.original.dentistID,
    startDate: row.original.startDate,
    endDate: row.original.endDate ?? undefined,
    description: row.original.description,
    nextAppointmentDate: row.original.nextAppointmentDate ?? undefined,
    status: row.original.status,
    paymentStatus: row.original.paymentStatus,
  };

  console.log(row.original?.planID);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: deleteTreatmentPlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });

      toast.success(
        "Delete treatment plan " + row.original.planID + " thành công!"
      );
      setIsOpen(false);
      setIsAlertOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    mutate(row?.original?.planID.toString());
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsHorizontalIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5} alignOffset={-5}>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Sửa thông tin
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsAlertOpen(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <TreatmentPlanUpdateDialog
        title="Update Treatment Plan"
        buttonTitle="Update Treatment Plan"
        open={isOpen}
        onOpenChange={setIsOpen}
        submitFunction={() => {}}
        defaultValues={defaultValues}
      />
      <AlertDelete
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        handleDelete={handleDelete}
      />
    </DropdownMenu>
  );
}

const AlertDelete = ({ isAlertOpen, setIsAlertOpen, handleDelete }: any) => (
  <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the
          treatment plan and remove its data from our servers.
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
