"use client";

import * as React from "react";

import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/userAPI";
import { useErrorNotification } from "@/hooks/useErrorNotification";

import jwt, { JwtPayload } from "jsonwebtoken";
import toast from "react-hot-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formLoginSchema = z.object({
  username: z.string().min(3, {
    message: "Username ít nhất 3 ký tự",
  }),
  password: z.string().min(3, {
    message: "Password ít nhất 3 ký tự",
  }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const { setCurrentUser } = useUserState();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res, variables) => {
      const { email, token } = res.data;

      localStorage.setItem("accessToken", token);
      const decoded = jwt.decode(token) as JwtPayload;
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const exp = decoded["exp"];

      if (role === "Admin" || role === "admin") {
        router.push("/admin");
      } else if (role === "ClinicOwner") {
        router.push("/clinicowner/clinic");
      } else if (role === "Dentist") {
        router.push("/dentist/appointment");
      } else {
        router.push("/");
      }

      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);

      setIsLoading(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    setIsLoading(true);

    mutate({
      username: values.username,
      password: values.password,
    });
  }

  return (
    <div className={cn("grid gap-6 space-y-4", className)} {...props}>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full text-shade-1-100%">
            {isLoading ? <Loading /> : "Đăng nhập"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
