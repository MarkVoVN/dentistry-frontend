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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppointmentModel, deleteAppointment } from "@/lib/api/appointmentAPI";
import AppointmentUpdateDialog from "./update-dialog";
import { useRouter } from "next/navigation";
import TreatmentPlanAddDialog from "../../treatmentPlan/components/create-dialog";
import _ from "lodash";
import useLocalStorage from "@/hooks/useLocalStorage";

export function ActionsDropdown({
  row,
}: {
  row: Row<
    AppointmentModel & {
      id?: string;
    }
  >;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isCreateTreatmentPlanOpen, setIsCreateTreatmentPlanOpen] =
    useState<boolean>(false);

  const [local_dentistId, setLocal_dentistId] = useLocalStorage<string>(
    "dentistId",
    "0"
  );

  const defaultValues = {
    appointmentID: row?.original?.appointmentID || 0,
    clinicID: row.original.clinicID || 0, // Change to 0 to match type
    scheduleID: row.original.clinicScheduleID || 0, // Added if needed
    customerID: row.original.customerID || 0, // Added if needed
    dentistID: row.original.dentistID || 0, // Added if needed
    serviceID: row.original.serviceID || 0, // Added if needed
    appointmentDate: row.original.appointmentDate || "", // Added if needed
    appointmentTime: row.original.appointmentTime || "", // Added if needed
    status: row.original.status || "", // Added if needed
  };

  // console.log(defaultValues);
  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      toast.success("Delete appointment " + row.original.id + " thành công!");
      setIsAlertOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    mutate(row?.original?.id ?? "");
  };
  const router = useRouter();

  const handleOpenChat = () => {
    localStorage.setItem("receiverId", row.original.customerID.toString());
    router.push("/chat");
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
          {row.original.customerID && (
            <DropdownMenuItem onSelect={() => handleOpenChat()}>
              Mở chat
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setIsCreateTreatmentPlanOpen(true)}>
            Tạo lộ trình điều trị
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsAlertOpen(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      {isCreateTreatmentPlanOpen && (
        <TreatmentPlanAddDialog
          hideTrigger={true}
          title="Add Treatment Plan"
          buttonTitle="Add Treatment Plan"
          open={true}
          onOpenChange={setIsCreateTreatmentPlanOpen}
          defaultValues={{
            dentistID: _.parseInt(local_dentistId),
            customerID: row.original.customerID,
          }}
          submitFunction={() => {}}
        />
      )}
      <AppointmentUpdateDialog
        title="Update AppointmendeleteAppointment"
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
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
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
