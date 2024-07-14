"use client";
import { CustomerModel, getCustomerById } from "@/lib/api/customerAPI";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { AppointmentModel, queryAppointment } from "@/lib/api/appointmentAPI";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import React from "react";
import CustomerAppointments from "./components/CustomerAppointments";
import {
  queryTreatmentPlan,
  TreatmentPlanModel,
} from "@/lib/api/treatmentPlanAPI";
import CustomerTreatments from "./components/CustomerTreatments";

export default function Profile() {
  const [profileId, setProfileId] = useState<string>();
  const [currentUser, setCurrentUser] = useState<CustomerModel>();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [treatments, setTreatments] = useState<TreatmentPlanModel[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded: any = jwt.decode(token);
      const userId =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
        ];
      setProfileId(userId);
      mutate({
        // CustomerID: userId
        CustomerID: undefined,
      });
      mutateTreatment({
        // CustomerID: userId
        CustomerID: undefined,
      });
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: queryAppointment,
    onSuccess: (res) => {
      const { data: appointments } = res;
      appointments.map((appointment: AppointmentModel) => {
        appointment.id = appointment.appointmentID.toString();
        return appointment;
      });
      setAppointments(appointments);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: mutateTreatment } = useMutation({
    mutationFn: queryTreatmentPlan,
    onSuccess: (res) => {
      const { data: treatments } = res;

      setTreatments(treatments);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  console.log(treatments);
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
        <CustomerAppointments appointments={appointments} />
        <CustomerTreatments treatments={treatments} />
      </div>
    </div>
  );
}
