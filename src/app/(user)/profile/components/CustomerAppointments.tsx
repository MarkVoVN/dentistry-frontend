import { Typography } from "@/components/ui/typography";
import { AppointmentModel } from "@/lib/api/appointmentAPI";
import { formatPriceToVND } from "@/lib/utils";
import {
  HospitalIcon,
  MapPin,
  HandCoinsIcon,
  DollarSignIcon,
  StethoscopeIcon,
  BriefcaseBusinessIcon,
  Calendar,
} from "lucide-react";
import moment from "moment";
import React from "react";
interface AppointmentsProps {
  appointments: AppointmentModel[];
}
export default function CustomerAppointments({
  appointments,
}: AppointmentsProps) {
  return (
    <div className="mt-8">
      <div className="text-xl font-bold mb-4">Appointments</div>
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment, key) => (
            <div
              key={key}
              className="flex flex-col bg-shade-1-100% rounded-xl shadow-lg"
            >
              <div className="flex flex-row justify-between px-4 py-2 bg-secondary-600 text-shade-1-100%  rounded-t-xl">
                <Typography headingElement="h2" headingStyle={"h6"}>
                  Appointment Info
                </Typography>
              </div>
              <div className="grid grid-cols-6  gap-4 py-2 px-4">
                <div className="col-span-3 flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {`${
                        appointment.appointmentDate
                          ? moment(appointment.appointmentDate).format("DD/MM/YYYY")
                          : ""
                      } - ${
                        appointment.appointmentTime
                          ? moment(appointment.appointmentTime).format("HH:mm")
                          : "N/A"
                      }`}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <HospitalIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {appointment.clinicName}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 ">
                    <MapPin className="w-4 h-6 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {appointment.address}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <HandCoinsIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {appointment.serviceName}
                    </Typography>
                  </div>
                </div>
                <div className=" col-span-3 flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {formatPriceToVND(appointment?.price ?? 0)}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <StethoscopeIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {appointment.dentistName}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <BriefcaseBusinessIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {appointment?.clinicPhoneNumber}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <div>No appointments found.</div>
      )}
    </div>
  );
}
