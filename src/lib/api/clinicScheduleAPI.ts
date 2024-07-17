import { request } from "../utils/axios.config";
export type ClinicScheduleCreateModel = {
  clinicId: string;
  dayOfWeek: string;
  slotDuration: number;
  openingTime: string;
  closingTime: string;
  maxPatientsPerSlot: number;
};
export type ClinicScheduleModel = ClinicScheduleCreateModel & {
  id?: string;
  scheduleID: string;
};

export type ClinicScheduleQuery = {
  OrderBy?: string;
  Date?: string;
  SearchTerm?: string;
  ClinicID?: number;
  ViewType?: "available" | "unavailable";
  PageNumber?: number;
  PageSize?: number;
};

export const fetchClinicScheduleList = () => {
  return request({
    method: "GET",
    url: `/clinicSchedule`,
  });
};

export const queryClinicScheduleList = (query: ClinicScheduleQuery) => {
  console.log(query);
  return request({
    method: "GET",
    url: `/clinicSchedule`,
    params: {
      ...query,
    },
  });
};

export const getClinicScheduleById = (id: string) => {
  return request({
    method: "GET",
    url: `/clinicSchedule/${id}`,
  });
};

export const createClinicSchedule = (data: ClinicScheduleCreateModel) => {
  return request({
    method: "POST",
    url: `/clinicSchedule`,
    data,
  });
};

export const updateClinicSchedule = (data: ClinicScheduleModel) => {
  // console.log(data);
  return request({
    method: "PUT",
    url: `/clinicSchedule/${data.scheduleID}`,
    params: {
      id: data.scheduleID,
    },
    data,
  });
};

export const deleteClinicSchedule = (id: string) => {
  return request({
    method: "DELETE",
    url: `/clinicSchedule/${id}`,
  });
};
