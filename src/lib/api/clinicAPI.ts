import { request } from "../utils/axios.config";

export type ClinicModel = {
  id?: string;
  clinicID?: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  openingHours: string; // Should be a date-time string
  closingHours: string; // Should be a date-time string
  image: string;
  status: boolean;
};

export const fetchClinicList = () => {
  return request({
    method: "GET",
    url: `/clinic`,
  });
};

export const getClinicById = (id: string) => {
  return request({
    method: "GET",
    url: `/clinic/${id}`,
  });
};

export const createClinic = (data: ClinicModel) => {
  return request({
    method: "POST",
    url: `/clinic`,
    data,
  });
};

export const updateClinic = (data: ClinicModel) => {
  console.log(data);
  return request({
    method: "PUT",
    url: `/clinic`,
    params: {
      id: data.id,
    },
    data,
  });
};

export const deleteClinic = (id: string) => {
  return request({
    method: "DELETE",
    url: `/clinic/${id}`,
  });
};
