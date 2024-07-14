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
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { uploadMultiImages } from "@/lib/utils/firebase-storage";
// import { createDentist } from "@/lib/api/clinicAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { ClinicModel, fetchClinicList } from "@/lib/api/clinicAPI";
import { createDentist, updateDentist } from "@/lib/api/dentistAPI";
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MyInputSelect } from "@/components/myinput";

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
  // username: z.string().min(2, {
  //   message: "Tên người dùng phải có ít nhất 2 ký tự",
  // }),
  specialization: z.string().min(2, {
    message: "Chuyên khoa phải có ít nhất 2 ký tự",
  }),
  clinicID: z.string().min(1, {
    message: "Vui lòng chọn phòng khám",
  }),
  // password: z.string().min(6, {
  //   message: "Mật khẩu phải có ít nhất 6 ký tự",
  // }),
  image: z.string().optional(),
  status: z.boolean().optional(),
});

export default function DentistUpdateDialog({
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

  const [clinics, setClinics] = useState<ClinicModel[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicModel>();

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

  const thumbs = defaultValues?.image
    ? [defaultValues?.image].map((file: any) => (
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      specialization: defaultValues?.specialization || "",
      clinicID: defaultValues?.clinicID || "",
      // password: defaultValues?.password || "",
      image: defaultValues?.image || "",
      status: defaultValues?.status || true,
    },
  });

  // Fetch clinic list
  const { data: clinicData, isLoading: isClinicLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinicList,
  });

  useEffect(() => {
    if (!isClinicLoading && clinicData) {
      // const { data, pagination } = clinicData;
      setClinics(clinicData.data);
      setSelectedClinic(
        clinicData.data.find(
          (clinic: any) => clinic.clinicID == defaultValues?.clinicID
        )
      );
    }
  }, [isClinicLoading, clinicData]);

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
    },
  });

  useErrorNotification({
    isError: status === "error",
    title: mutateError?.message,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("HELLO");
    let image = defaultValues?.image;
    if (selectedImages.length > 0) {
      image = (
        await uploadMultiImages(selectedImages, "/dentist/" + values.name)
      )[0];
    }

    mutate({
      dentistId: defaultValues?.dentistId ?? 0,
      name: values.name || "",
      phoneNumber: values.phoneNumber || "",
      email: values.email || "",
      // username: values.username || "",
      specialization: values.specialization || "",
      clinicID: _.parseInt(values.clinicID),
      // password: values.password || "",
      image: image || "",
      status: values.status || false,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  {/* <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
                <div id="right">
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
                  {!isClinicLoading && (
                    <FormField
                      control={form.control}
                      name="clinicID"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <MyInputSelect
                              props={{
                                path: "clinicID",
                                value: selectedClinic?.clinicID,
                                valueDisplay: selectedClinic?.name,
                                placeholderText: "Select Clinic",
                                label: "Clinic",
                                items: clinics?.map((clinic: any) => ({
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
                                form.setValue("clinicID", value.toString());
                                setSelectedClinic(
                                  clinics.find(
                                    (clinic) => clinic.clinicID === value
                                  )
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
              </div>
              <DialogFooter className="space-x-2">
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button> */}
                <Button
                  variant={"outline"}
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Update dentist
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
