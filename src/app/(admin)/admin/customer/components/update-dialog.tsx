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

import { uploadMultiImages } from "@/lib/utils/firebase-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { updateCustomer } from "@/lib/api/customerAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";
import { Spinnaker } from "next/font/google";

const formSchema = z.object({
  customerID: z.string(),
  name: z.string().min(2, {
    message: "Tên khách hàng phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự",
  }),
  address: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự",
  }),
  gender: z.string().optional(),
  image: z.string().optional(),
  status: z.boolean().optional(),
});

export default function CustomerUpdateDialog({
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
    customerID: string;
    name: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    gender: string;
    image: string;
    status: boolean;
  };
  submitFunction: any;
  isOpen: boolean;
  setIsOpen: any;
}) {
  const [selectedImages, setSelectedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setSelectedImages(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs =
    defaultValues?.image && selectedImages.length == 0
      ? [defaultValues?.image].map((file: any) => (
          <div key={file}>
            <div className="bg-neutral-3">
              <Image
                src={defaultValues?.image}
                width={500}
                height={500}
                alt="??"
                className="object-cover w-full aspect-video "
              />
            </div>
          </div>
        ))
      : selectedImages.map((file: any) => (
          <div key={file.name}>
            <div>
              <Image
                src={file.preview}
                width={500}
                height={500}
                alt="??"
                className="object-cover w-full aspect-video "
              />
            </div>
          </div>
        ));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name,
      email: defaultValues?.email,
      dateOfBirth:
        moment(defaultValues?.dateOfBirth).format("YYYY-MM-DD") || "",
      phoneNumber: defaultValues?.phoneNumber,
      address: defaultValues?.address,
      gender: defaultValues?.gender ?? "Other",
      image: defaultValues?.image,
      status: defaultValues?.status,
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      toast.success("Sửa khách hàng " + variables.name + " thành công!");
      setIsOpen(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let image = defaultValues?.image;
    if (selectedImages.length > 0) {
      image = (
        await uploadMultiImages(
          selectedImages,
          "/customer/" + defaultValues?.customerID || values.name
        )
      )[0];
    }

    mutate({
      name: values.name || "",
      email: values.email || "",
      dateOfBirth: moment(values.dateOfBirth).toISOString() || "",
      phoneNumber: values.phoneNumber || "",
      address: values.address || "",
      gender: values.gender || "",
      image: image || "",
      status: values.status || false,
      customerID: defaultValues?.customerID || "",
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
              // onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pt-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div id="left">
                  <span>Thêm ảnh</span>
                  <div
                    className="w-full aspect-video cursor-pointer mt-2"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <div className="w-full aspect-video border-4 border-dashed border-secondary rounded-[8px] flex justify-center items-center gap-2 flex-col">
                        <span className="text-xs font-semibold text-secondary-900">
                          Kéo ảnh để vào đây...
                        </span>
                      </div>
                    ) : (
                      <div className="w-full aspect-video border-4 border-dashed border-secondary rounded-[8px] flex justify-center items-center gap-2 flex-col">
                        {thumbs.length != 0 ? (
                          thumbs
                        ) : (
                          <>
                            <div className="text-secondary font-bold">
                              Thêm ảnh cho khách hàng
                            </div>
                            <span className="text-xs font-semibold text-secondary-900">
                              Kéo thả hoặc nhấn vào để thêm ảnh
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Tên khách hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Date of Birth"
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div id="right">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("gender", value)
                            }
                            defaultValue={field?.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { text: "Male", value: "Male" },
                                { text: "Female", value: "Female" },
                                { text: "Other", value: "Other" },
                              ].map(({ text, value }) => (
                                <SelectItem key={value} value={value}>
                                  {text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("status", value === "true")
                            }
                            defaultValue={field?.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { text: "Active", value: "true" },
                                { text: "In Active", value: "false" },
                              ].map(({ text, value }) => (
                                <SelectItem key={value} value={value}>
                                  {text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  disabled={status === "pending"}
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(form.getValues());
                  }}
                  className="relative"
                >
                  {status === "pending" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cập nhật khách hàng"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
