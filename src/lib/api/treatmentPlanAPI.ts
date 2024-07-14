import { request } from "../utils/axios.config";
// import { ClinicModel } from "./clinicAPI";

export type TreatmentPlanCreateModel = {
  customerID: number;
  dentistID: number;
  startDate: string;
  endDate?: string;
  description: string;
  nextAppointmentDate?: string;
  status: string;
  paymentStatus: string;
};

export type TreatmentPlanModel = TreatmentPlanCreateModel & {
  id?: string;
  planID: number;
  dentistPhoneNumber?: string;
  dentistName?: string;
  clinicPhoneNumber?: string;
  clinicName?: string;
};

export type TreatmentPlanQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  ClinicID?: string;
  CustomerID?: string;
  DentistID?: string;
  PageNumber?: number;
  PageSize?: number;
};

const BASE_URL = "/TreatmentPlan";

export const getTreatmentPlanList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
  });
};

export const getTreatmentPlanById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createTreatmentPlan = (data: TreatmentPlanCreateModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};

export const updateTreatmentPlan = (data: TreatmentPlanModel) => {
  return request({
    method: "PUT",
    url: `${BASE_URL}/${data.planID}`,
    data,
  });
};

export const deleteTreatmentPlan = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};

export const queryTreatmentPlan = (query: TreatmentPlanQuery) => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    params: {
      ...query,
    },
  });
};
