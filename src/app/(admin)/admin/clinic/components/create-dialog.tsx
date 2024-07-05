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
import slugify from "@sindresorhus/slugify";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";

import toast from "react-hot-toast";
import { convertHHmmToISO, splitString } from "@/lib/utils";
import { uploadMultiImages } from "@/lib/utils/firebase-storage";
import { createClinic, updateClinic } from "@/lib/api/clinicAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phòng khám phải có ít nhất 2 ký tự",
  }),
  address: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  image: z.string().optional(),
  status: z.boolean().optional(),
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
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    openingHours: string;
    closingHours: string;
    image: string;
    status: boolean;
  };
  submitFunction: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [selectedImages, setSelectedImages] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(open);

  const setDialogOpenState = (state: boolean) => {
    setDialogOpen(state);
    onOpenChange?.(state);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setSelectedImages(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs = selectedImages.map((file: any) => (
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      address: defaultValues?.address || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      openingHours: defaultValues?.openingHours || "",
      closingHours: defaultValues?.closingHours || "",
      image: defaultValues?.image || "",
      status: defaultValues?.status || false,
    },
  });

  //watch
  const watchFields = form.watch([
    "name",
    "address",
    "phoneNumber",
    "email",
    "openingHours",
    "closingHours",
  ]);

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: createClinic,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });

      toast.success("Tạo phòng khám " + variables.name + " thành công!");

      setDialogOpenState(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const image = await uploadMultiImages(
      selectedImages,
      "/clinic/" + defaultValues?.id || values.name
    );

    mutate({
      name: values.name || "",
      address: values.address || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      openingHours: convertHHmmToISO(values.openingHours || ""),
      closingHours: convertHHmmToISO(values.closingHours || ""),
      image: image[0] || "",
      status: values.status || false,
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
                  {/* image */}
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
                              Thêm ảnh cho phòng khám
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
                        <FormLabel>Tên phòng khám</FormLabel>
                        <FormControl>
                          <Input placeholder="Clinic Name" {...field} />
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
                </div>
                <div id="right">
                  <FormField
                    control={form.control}
                    name="openingHours"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Giờ mở cửa</FormLabel>
                        <FormControl>
                          <TimePicker
                            format="HH:mm"
                            onChange={(value) =>
                              form.setValue("openingHours", value?.toString())
                            }
                            value={form.watch("openingHours")}
                            shouldOpenClock={() => false}
                            className={"w-full"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="closingHours"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Giờ đóng cửa</FormLabel>
                        <FormControl>
                          <TimePicker
                            format="HH:mm"
                            onChange={(value) =>
                              form.setValue("closingHours", value?.toString())
                            }
                            value={form.watch("closingHours")}
                            shouldOpenClock={() => false}
                            className={"w-full"}
                          />
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
