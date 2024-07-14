"use client";
import { CustomerModel, getCustomerById } from "@/lib/api/customerAPI";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { AppointmentModel } from "@/lib/api/appointmentAPI";

export default function Profile() {
  const [profileId, setProfileId] = useState<string>();
  const [currentUser, setCurrentUser] = useState<CustomerModel>();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded: any = jwt.decode(token);
      const userId =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];

      setProfileId(userId);
    }
  }, []);
  useEffect(() => {
    if (!currentUser && !profileId) return;
    getCustomerById(profileId!).then((res) => {
      setCurrentUser(res.data);
    });
  }, [profileId, setProfileId]);
  if (!currentUser) return <div>Loading...</div>;
  return (
    <div className="flex justify-center mt-8 mb-8">
      <div className="w-[50%] bg-white p-8 rounded-lg shadow-lg">
        <div className="text-2xl font-bold mb-4">{currentUser?.name}</div>
        <div className="w-50 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 font-semibold">Email:</span>
            <p className="col-span-9">{currentUser?.email}</p>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 font-semibold">Phone:</span>
            <p className="col-span-9">{currentUser?.phoneNumber}</p>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 font-semibold">Date of birth:</span>
            <p className="col-span-9">
              {currentUser?.dateOfBirth
                ? new Date(currentUser.dateOfBirth).toLocaleDateString("en-GB")
                : ""}
            </p>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 font-semibold">Address:</span>
            <p className="col-span-9">{currentUser?.address}</p>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 font-semibold">Gender:</span>
            <p className="col-span-9">{currentUser?.gender}</p>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-xl font-bold mb-4">Appointments</div>
         
        </div>
      </div>
    </div>
  );
}
