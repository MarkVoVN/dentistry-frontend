import { request } from "../utils/axios.config";
import _ from "lodash";
import { ClinicModel } from "./clinicAPI";

export type DentistCreateModel = {
  clinicID: number;
  email: string;
  image: string;
  // username: string;
  name: string;
  phoneNumber: string;
  specialization: string;
  status?: boolean;
};

export type DentistModel = DentistCreateModel & {
  id?: string;
  dentistId: number;
  clinic?: ClinicModel;
};

export type DentistUpdateModel = Pick<
  DentistModel,
  "id" | "name" | "phoneNumber" | "email" | "specialization" | "status"
> & {
  id?: string;
  dentistId: number;
};

export type DentistQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  ClinicID?: string;
  PageNumber?: number;
  PageSize?: number;
};

const BASE_URL = "/dentist";

export const getDentistList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
  });
};

export const getDentistById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createDentist = (
  data: DentistCreateModel & { password: string; username: string }
) => {
  return request({
    method: "POST",
    url: `/Account/register-dentist`,
    data,
  });
};

export const updateDentist = (data: DentistModel) => {
  return request({
    method: "PUT",
    url: `${BASE_URL}`,
    params: {
      id: data.dentistId,
    },
    data,
  });
};

export const deleteDentist = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};

export const queryDentist = (query: DentistQuery) => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    params: {
      ...query,
    },
  });
};
