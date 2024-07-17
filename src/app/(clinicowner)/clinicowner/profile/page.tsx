"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import { SpecificUser } from "@/lib/api/userAPI";
import _ from "lodash";
import ClinicOwnerUpdateSection from "./update-section";
import { useQuery } from "@tanstack/react-query";
import PasswordResetDialog from "@/components/resetPasswordDialog";
import { Typography } from "@/components/ui/typography";

export default function ClinicOwnerProfilePage() {
  const [currentUser, setCurrentUser] = useLocalStorage<SpecificUser>(
    "currentUser",
    {}
  );

  return (
    <div className="flex justify-center ">
      <div className="bg-shade-1-100% w-1/2 p-4 rounded-[8px] space-y-4 text-shade-2-100%">
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Clinic Owner Profile
            </h2>
          </div>
        </div>
        {currentUser && (
          <ClinicOwnerUpdateSection
            title="Sửa nhân viên"
            isOpen={true}
            setIsOpen={() => {}}
            submitFunction={(newUserData: any) => {
              console.log(newUserData);
              setCurrentUser({
                ...currentUser,
                ...newUserData,
              });
            }}
            defaultValues={{
              ownerID: _.parseInt(currentUser.ownerID ?? "0"),
              name: currentUser.name || "",
              phoneNumber: currentUser.phoneNumber || "",
              email: currentUser.email || "",
              clinicId: currentUser.clinicID || "",
              status: currentUser.status || false,
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
