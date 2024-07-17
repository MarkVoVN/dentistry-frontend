"use client";

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
import { uploadMultiImages } from "@/lib/utils/firebase-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
// import { createDentist } from "@/lib/api/clinicAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { updateDentist } from "@/lib/api/dentistAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên bác sĩ phải có ít nhất 2 ký tự",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  specialization: z.string().min(2, {
    message: "Chuyên khoa phải có ít nhất 2 ký tự",
  }),
  clinicID: z.string().min(1, {
    message: "Vui lòng chọn phòng khám",
  }),
  image: z.string().optional(),
  status: z.boolean().optional(),
});

export default function DentistUpdateSection({
  title = "Thêm bác sĩ",
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
    dentistId: number;
    name: string;
    phoneNumber: string;
    email: string;
    username?: string;
    specialization: string;
    clinicID: string;
    password?: string;
    image: string;
    status: boolean;
  };
  submitFunction: any;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
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
    selectedImages.length > 0 || defaultValues?.image === undefined
      ? selectedImages.map((file: any) => (
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
        ))
      : [defaultValues?.image].map((file: any) => (
          <div key={file.name}>
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
        ));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      specialization: defaultValues?.specialization || "",
      clinicID: defaultValues?.clinicID || "",
      image: defaultValues?.image || "",
      status: defaultValues?.status || true,
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateDentist,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });

      toast.success("Cập nhật bác sĩ " + variables.name + " thành công!");

      onOpenChange(false);

      submitFunction();
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
        await uploadMultiImages(selectedImages, "/dentist/" + values.name)
      )[0];
      if (!image || image === "") {
        toast.error("Error: failed to upload image");
        return;
      }
    }

    mutate({
      dentistId: defaultValues?.dentistId ?? 0,
      name: values.name || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      specialization: values.specialization || "",
      clinicID: _.parseInt(values.clinicID),
      image: image || "",
      status: values.status || false,
    });
  }

  return (
    <div className="gap-4 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
          <div className="flex flex-col gap-3">
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
                        Thêm ảnh cho bác sĩ
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
                  <FormLabel>Tên bác sĩ</FormLabel>
                  <FormControl>
                    <Input placeholder="Dentist Name" {...field} />
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
              name="specialization"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Chuyên khoa</FormLabel>
                  <FormControl>
                    <Input placeholder="Specialization" {...field} />
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
                      defaultValue={field?.value ? "true" : "false"}
                      disabled={true}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { text: "Licensed", value: "true" },
                          { text: "Not Licensed", value: "false" },
                        ]?.map(({ text, value }) => (
                          <SelectItem key={text} value={value}>
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

          <div className="flex justify-end">
            <Button
              variant={"outline"}
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              Update dentist
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
