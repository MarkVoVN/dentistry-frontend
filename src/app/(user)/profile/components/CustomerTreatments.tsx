import { Typography } from "@/components/ui/typography";
import { AppointmentModel } from "@/lib/api/appointmentAPI";
import { TreatmentPlanModel } from "@/lib/api/treatmentPlanAPI";
import { formatPriceToVND } from "@/lib/utils";
import {
  HospitalIcon,
  MapPin,
  HandCoinsIcon,
  DollarSignIcon,
  StethoscopeIcon,
  BriefcaseBusinessIcon,
  Calendar,
  CalendarClock,
} from "lucide-react";
import moment from "moment";
import React from "react";
interface TreatmentProps {
  treatments: TreatmentPlanModel[];
}
export default function CustomerTreatments({ treatments }: TreatmentProps) {
  return (
    <div className="mt-8">
      <div className="text-xl font-bold mb-4">Treatments</div>
      {treatments.length > 0 ? (
        <ul className="space-y-4">
          {treatments.map((treatment) => (
            <div className="flex flex-col bg-shade-1-100% rounded-xl shadow-lg">
              <div className="flex flex-row justify-between px-4 py-2 bg-[#9EE67E] text-shade-1-100%  rounded-t-xl">
                <Typography headingElement="h2" headingStyle={"h6"}>
                  Treatment Information
                </Typography>
              </div>
              <div className="grid grid-cols-6  gap-4 py-2 px-4">
                <div className="col-span-3 flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <HospitalIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {`${treatment.clinicName} - ${treatment.clinicPhoneNumber}`}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <HandCoinsIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {`${treatment.dentistName} - ${treatment.dentistPhoneNumber}`}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <HandCoinsIcon className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {treatment.paymentStatus}
                    </Typography>
                  </div>
                </div>
                <div className=" col-span-3 flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {`${
                        treatment.startDate
                          ? moment(treatment.startDate).format("DD/MM/YYYY")
                          : ""
                      } - ${
                        treatment.endDate
                          ? moment(treatment.endDate).format("DD/MM/YYYY")
                          : "N/A"
                      }`}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <CalendarClock className="w-4 h-4 mr-2" />
                    <Typography
                      headingElement="h5"
                      headingStyle={"p"}
                      className="text-neutral-7 w-full"
                    >
                      {moment(treatment.nextAppointmentDate).format(
                        "DD/MM/YYYY"
                      )}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography
                    headingElement="h3"
                    headingStyle={"p"}
                    className="text-neutral-8 font-medium w-full"
                  >
                    Description
                  </Typography>
                  <Typography
                    headingElement="h5"
                    headingStyle={"p"}
                    className="text-neutral-7  w-full"
                  >
                    {treatment.description}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <div>No treatments found.</div>
      )}
    </div>
  );
}
