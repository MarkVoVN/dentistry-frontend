import { request } from "../utils/axios.config";
import { ClinicModel } from "./clinicAPI";

export type ClinicOwnerModel = {
  id?: string;
  ownerID?: number;
  name: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  clinicID: string;
  clinicDto?: ClinicModel;
};

export const fetchClinicOwnerList = () => {
  return request({
    method: "GET",
    url: `/clinicOwner`,
  });
};

export const getClinicOwnerById = (id: string) => {
  return request({
    method: "GET",
    url: `/clinicOwner/getById/${id}`,
  });
};

export const createClinicOwner = (data: ClinicOwnerModel) => {
  return request({
    method: "POST",
    url: `/clinicOwner`,
    data,
  });
};

export const updateClinicOwner = (data: ClinicOwnerModel) => {
  console.log(data);
  return request({
    method: "PUT",
    url: `/clinicOwner/${data.id}`,
    params: {
      id: data.id,
    },
    data,
  });
};

export const deleteClinicOwner = (id: string) => {
  return request({
    method: "DELETE",
    url: `/clinicOwner/${id}`,
  });
};
