import { request } from "../utils/axios.config";

export type AppointmentCreateModel = {
  clinicID: number;
  clinicScheduleID: number;
  customerID: number;
  dentistID: number;
  serviceID: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
};

export type AppointmentModel = AppointmentCreateModel & {
  id?: string;
  appointmentID: number;
  clinicName?: string;
  customerName?: string;
  dentistName?: string;
  serviceName?: string;
  price?: number;
  address?: string;
  clinicPhoneNumber?: string;
};

const BASE_URL = "/appointments";

export type AppointmentQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  ClinicID?: string;
  DentistID?: string;
  PageNumber?: number;
  PageSize?: number;
  CustomerID?: string;
};

export const getAppointmentList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
  });
};

export const getAppointmentById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createAppointment = (data: AppointmentCreateModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};

export const updateAppointment = (data: AppointmentModel) => {
  return request({
    method: "PUT",
    url: `${BASE_URL}/${data.appointmentID}`,
    data,
  });
};

export const deleteAppointment = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};

export const queryAppointment = (query: AppointmentQuery) => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    params: {
      ...query,
    },
  });
};
