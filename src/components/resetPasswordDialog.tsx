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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { X } from "lucide-react";
import { resetPassword } from "@/lib/api/userAPI";
import { Close } from "@radix-ui/react-dialog";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Tên người dùng phải có ít nhất 2 ký tự",
  }),
  newPassword: z.string().min(6, {
    message: "Mật khẩu mới phải có ít nhất 6 ký tự",
  }),
});

export default function PasswordResetDialog({
  title = "Reset Password",
  hideTrigger = false,
  buttonTitle = "Reset Password",
  description,
  isOpen = false,
  setIsOpen,
}: {
  hideTrigger?: boolean;
  buttonTitle?: string;
  title?: string;
  description?: string;
  isOpen?: boolean;
  setIsOpen?: any;
}) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(isOpen);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    setIsOpen?.(open);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful! Redirecting to login...");

      router.push("/login");
    },
    onError: () => {
      toast.error("Password reset failed!");
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      username: values.username,
      newPassword: values.newPassword,
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">{buttonTitle}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="lg:min-w-[30%]  max-h-[70%] overflow-y-scroll lg:overflow-auto p-0">
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
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Reset Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
