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

import CustomerUpdateDialog from "./update-dialog";
import { CustomerModel, deleteCustomer } from "@/lib/api/customerAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ActionsDropdown({
  row,
}: {
  row: Row<
    CustomerModel & {
      createdAt: any;
      updatedAt: any;
    }
  >;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const defaultValues = {
    customerID: row?.original?.customerID || "",
    name: row.original.name || "",
    address: row.original.address || "",
    phoneNumber: row.original.phoneNumber || "",
    email: row.original.email || "",
    dateOfBirth: row.original.dateOfBirth || "",
    gender: row.original.gender || "Other",
    image: row.original.image || "",
    status: row.original.status || false,
  };

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      toast.success("Xóa khách hàng " + row.original.name + " thành công!");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    mutate(row?.original?.customerID);
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
      <CustomerUpdateDialog
        title="Sửa khách hàng"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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
