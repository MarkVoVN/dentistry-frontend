import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import "react-time-picker/dist/TimePicker.css";
import {
  ClinicModel,
  fetchClinicList,
  updateClinic,
} from "@/lib/api/clinicAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MyInputSelect, MyPriceInput } from "@/components/myinput";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";
import { updateDentist } from "@/lib/api/dentistAPI";
import { uploadMultiImages } from "@/lib/utils/firebase-storage";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const dentistFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên người dùng không được bỏ trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
  specialization: z
    .string()
    .min(2, { message: "Chuyên môn phải có ít nhất 2 ký tự" }),
  image: z.string().optional(),
  clinicID: z.number(),
  status: z.boolean().optional(),
});


export default function DentistUpdateDialog({
  title = "Title",
  description,
  defaultValues,
  submitFunction,
  isOpen,
  setIsOpen,
  onSuccess,
  onFail,
  hideTrigger = false,
}: {
  title?: string;
  description?: string;
  buttonTitle?: string;
  defaultValues?: {
    id?: string;
    username?: string;
    email?: string;
    password?: string;
    name: string;
    phoneNumber?: string;
    specialization?: string;
    image?: string;
    clinicID?: number;
    status?: boolean;
  };
  submitFunction: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: any;
  onFail?: any;
  hideTrigger?: boolean;
}) {
  const [clinicList, setClinicList] = useState<ClinicModel[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();
  const [dialogOpen, setDialogOpen] = useState(open);
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

  const form = useForm<z.infer<typeof dentistFormSchema>>({
    resolver: zodResolver(dentistFormSchema),
    defaultValues: {
      username: defaultValues?.username || "",
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      specialization: defaultValues?.specialization || "",
      image: defaultValues?.image || "",
      clinicID: defaultValues?.clinicID || 0,
      status: defaultValues?.status || true,
    },
  });

  console.log("default Value: ", defaultValues)

  const queryClient = useQueryClient();

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: updateDentist,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Cập nhật nha sĩ " + variables.name + " thành công!");
      setIsOpen(false);
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data, pagination } = req_data;
      setClinicList(data);
      setSelectedClinic(
        data.find((clinic: any) => clinic.clinicID === defaultValues?.clinicID)
      );
    }
  }, [isSuccess]);

  useErrorNotification({
    isError,
    title: error?.message,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs =
    defaultValues?.image && selectedImages.length == 0
      ? [defaultValues?.image].map((file: any) => (
          <div key={file}>
            <div className="bg-neutral-3">
              <Image
                src={defaultValues.image || ''}
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

  // TODO: Update Dentist
  async function onSubmit(values: z.infer<typeof dentistFormSchema>) {
    console.log("onSubmit triggered with values:", values);

    // Check for validation errors
    const { errors } = form.formState; // Access the form state
    if (Object.keys(errors).length > 0) {
        console.error("Validation errors:", errors);
        return; // Prevent submission if there are validation errors
    }

    try {
        const image = await uploadMultiImages(
            selectedImages,
            "/dentist/" + (defaultValues?.id || values.name)
        );

        mutate({
            dentistId: _.parseInt(defaultValues?.id ?? '0'),
            username: values.username,
            email: values.email,
            password: values.password,
            name: values.name,
            phoneNumber: values.phoneNumber,
            specialization: values.specialization,
            image: image[0] || "",
            clinicID: values.clinicID,
            status: values.status,
        });
    } catch (error) {
        console.error("Error during submission:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className=" max-h-[90%] overflow-y-scroll lg:overflow-auto">
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
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Tên nha sĩ</FormLabel>
                      <Input placeholder="Tên nha sĩ" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                              Thêm ảnh cho nha sĩ
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
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <Input placeholder="Tên đăng nhập" {...field} />
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
                      <Input type="email" placeholder="Email" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        {...field}
                      />
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
                      <Input placeholder="Số điện thoại" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Chuyên môn</FormLabel>
                      <Input placeholder="Chuyên môn" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="clinicID"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        {/* <FormLabel>Clinic</FormLabel> */}
                        <MyInputSelect
                          props={{
                            defaultValue: defaultValues?.clinicID,
                            path: "clinicID",
                            value: selectedClinic?.clinicID,
                            valueDisplay: selectedClinic?.name,
                            placeholderText: "Select Clinic",
                            label: "Clinic",
                            items: clinicList?.map((clinic: any) => ({
                              value: clinic.clinicID,
                              text: clinic.name,
                            })),
                          }}
                          updateFormData={({
                            path,
                            value,
                          }: {
                            path: string;
                            value: any;
                          }) => {
                            form.setValue("clinicID", value);
                            setSelectedClinic(
                              clinicList.find((clinic) => clinic.clinicID === value)
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%"
                >
                  Cập Nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
