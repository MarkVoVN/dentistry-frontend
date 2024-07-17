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
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { updateClinic } from "@/lib/api/clinicAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { convertHHmmToISO, convertISOtoHHmm } from "@/lib/utils";
import moment from "moment";

const formSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      if (data.openingHours && data.closingHours) {
        const opening = moment(data.openingHours, "HH:mm");
        const closing = moment(data.closingHours, "HH:mm");
        return opening.isBefore(closing);
      }
      return true;
    },
    {
      message: "Closing time must be after opening time",
      path: ["closingHours"],
    }
  );

export default function ClinicUpdateSection({
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
    id?: string;
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
  isOpen: boolean;
  setIsOpen: any;
}) {
  console.log(defaultValues);
  const [selectedImages, setSelectedImages] = useState([]);

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

  const thumbs =
    defaultValues?.image && selectedImages.length == 0
      ? [defaultValues?.image].map((file: any) => (
          <div key={file} className="w-full h-full">
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
          <div key={file.name} className="w-full h-full">
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
      address: defaultValues?.address,
      phoneNumber: defaultValues?.phoneNumber,
      email: defaultValues?.email,
      openingHours: convertISOtoHHmm(defaultValues?.openingHours || ""),
      closingHours: convertISOtoHHmm(defaultValues?.closingHours || ""),
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
    mutationFn: updateClinic,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });

      toast.success("Sửa phòng khám " + variables.name + " thành công!");
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
          "/clinic/" + defaultValues?.id || values.name
        )
      )[0];
    }

    mutate({
      clinicID: defaultValues?.id || "",
      name: values.name || "",
      address: values.address || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      openingHours: moment(
        `1970-01-01T${values.openingHours}:00.000Z`
      ).toISOString(),
      closingHours: moment(
        `1970-01-01T${values.closingHours}:00.000Z`
      ).toISOString(),
      image: image || "",
      status: values.status || false,
    });
  }

  console.log(form.getValues("closingHours"));

  return (
    <div className="gap-4 py-2 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
          <div className="flex flex-col gap-8">
            <div id="left" className="w-full">
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
            </div>
            <div id="right" className="w-full">
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
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Giờ mở cửa</FormLabel>
                    <FormControl>
                      <Input type="time" className={"w-full"} {...field} />
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
                      <Input type="time" className={"w-full"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-row justify-end">
            <Button type="submit" variant={"outline"} className="">
              Cập nhật
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
