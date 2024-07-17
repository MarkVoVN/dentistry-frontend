"use client";

import PasswordResetDialog from "@/components/resetPasswordDialog";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getDentistById } from "@/lib/api/dentistAPI";
import { SpecificUser } from "@/lib/api/userAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DentistUpdateSection from "./update-section";

import jwt, { JwtPayload } from "jsonwebtoken";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { query } from "firebase/firestore";

export default function ClinicOwnerProfilePage() {
  const [currentUser, setCurrentUser] = useLocalStorage<SpecificUser>(
    "currentUser",
    {}
  );

  console.log(currentUser);

  const {
    data: req_data,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["dentistProfile", currentUser.dentistId],
    queryFn: () => getDentistById(currentUser.dentistId ?? "0"),
  });

  const queryClient = useQueryClient();

  return (
    <div className="flex justify-center ">
      <div className="bg-shade-1-100% w-1/2 p-4 rounded-[8px] space-y-4 text-shade-2-100%">
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Dentist Profile
            </h2>
          </div>
        </div>
        {req_data && isSuccess && (
          <DentistUpdateSection
            title="Sửa nhân viên"
            open={true}
            onOpenChange={() => {}}
            submitFunction={() => {
              queryClient.invalidateQueries({ queryKey: ["dentistProfile"] });
            }}
            defaultValues={{
              dentistId: req_data?.data.dentistId || 0,
              name: req_data?.data.name || "",
              email: req_data?.data?.email || "",
              phoneNumber: req_data?.data?.phoneNumber || "",
              specialization: req_data?.data?.specialization || "",
              image: req_data?.data?.image || "",
              clinicID: (req_data?.data.clinicID || 0).toString(),
              status: req_data?.data.status || true,
            }}
          />
        )}
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Account Settings
            </h2>
          </div>
        </div>
        <div className="flex">
          <PasswordResetDialog />
        </div>
      </div>
    </div>
  );
}
