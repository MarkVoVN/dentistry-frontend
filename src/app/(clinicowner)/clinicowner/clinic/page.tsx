"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import {
  ClinicModel,
  fetchClinicList,
  getClinicById,
} from "@/lib/api/clinicAPI";
import ClinicAddDialog from "./components/create-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { columns } from "./columns";

import jwt, { JwtPayload } from "jsonwebtoken";
import { useMutation } from "@tanstack/react-query";
import { getClinicOwnerById } from "@/lib/api/clinicOwnerAPI";
import toast from "react-hot-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import ClinicUpdateSection from "./UpdateSection";
import moment from "moment";

export default function ClinicManagementPage() {
  const [clinicId, setClinicId] = useLocalStorage<string>("ClinicID", "0");
  const [clinic, setClinic] = useState<ClinicModel>();
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const coID =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      mutate(coID);
    } catch (err) {}
  }, []);

  const {
    mutate,
    status,
    error: mutateError,
  } = useMutation({
    mutationFn: getClinicOwnerById,
    onSuccess: (res, variables) => {
      const { clinicID } = res.data;
      setClinicId(clinicID);
      mutate_getClinic(clinicID);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: mutate_getClinic,
    status: status_clinic,
    error: error_clinic,
  } = useMutation({
    mutationFn: getClinicById,
    onSuccess: (res, variables) => {
      setClinic(res.data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex justify-center ">
      <div className="bg-shade-1-100% w-1/2 p-4 rounded-[8px] space-y-4 text-shade-2-100%">
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Clinic Management
            </h2>
          </div>
        </div>
        {clinic && (
          <ClinicUpdateSection
            title="Sửa phòng khám"
            isOpen={true}
            setIsOpen={() => {}}
            submitFunction={() => {}}
            defaultValues={{
              id: clinic?.clinicID || "",
              name: clinic?.name || "",
              address: clinic?.address || "",
              phoneNumber: clinic?.phoneNumber || "",
              email: clinic?.email || "",
              openingHours: clinic?.openingHours || moment().toISOString(),
              closingHours: clinic?.closingHours || moment().toISOString(),
              image: clinic?.image || "",
              status: clinic?.status || false,
            }}
          />
        )}
      </div>
    </div>
  );
}
