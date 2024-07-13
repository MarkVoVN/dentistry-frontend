import { request } from "../utils/axios.config";
import { ClinicModel } from "./clinicAPI";

export type ClinicOwnerCreateModel = {
  name: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  clinicID: string;
  clinicDto?: ClinicModel;
};

export type ClinicOwnerModel = ClinicOwnerCreateModel & {
  id?: string;
  ownerID?: number;
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

export const createClinicOwner = (data: ClinicOwnerCreateModel) => {
  console.log(data);
  
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
