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
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/userAPI";
import { useErrorNotification } from "@/hooks/useErrorNotification";

import toast from "react-hot-toast";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formLoginSchema = z.object({
  username: z.string().min(3, {
    message: "Username ít nhất 3 ký tự",
  }),
  email: z.string().min(3, {
    message: "Username ít nhất 3 ký tự",
  }),
  password: z.string().min(3, {
    message: "Password ít nhất 3 ký tự",
  }),
});

export function UseRegisterForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const { setCurrentUser } = useUserState();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (res, variables) => {
      toast.success("Đăng ký thành công");
      router.push("/login");
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
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className={cn("grid gap-1 space-y-2", className)} {...props}>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
            {isLoading ? <Loading /> : "Đăng ký"}
          </Button>
        </form>
      </Form>
      <div className="flex flex-row justify-center">
        <Typography headingElement="p" headingStyle={"p"} className="">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-700 hover:underline hover:text-primary"
          >
            Login now
          </Link>
        </Typography>
      </div>
    </div>
  );
}
