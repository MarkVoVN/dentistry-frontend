import { request } from "../utils/axios.config";

type AppointmentCreateModel = {
  clinicID: number;
  clinicScheduleID: number;
  customerID: number;
  dentistID: number;
  serviceID: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
};

const BASE_URL = "/appointments";

export const createAppointment = (data: AppointmentCreateModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};
