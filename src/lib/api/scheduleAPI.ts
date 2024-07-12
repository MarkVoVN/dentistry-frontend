import { request } from "../utils/axios.config";

export type ScheduleQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  Date?: string;
  ClinicID?: string;
  ViewType?: "available" | "unavailable" | "";
  PageNumber?: number;
  PageSize?: number;
};

export type ScheduleModel = {
  scheduleID: number;
  clinicID: number;
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  appointmentDate: string;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  maxPatientsPerSlot: number;
};

const BASE_URL = "/clinicSchedule";

export const getScheduleList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
  });
};

export const getScheduleById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createSchedule = (data: ScheduleModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};

export const updateSchedule = (data: ScheduleModel) => {
  return request({
    method: "PUT",
    url: `${BASE_URL}/${data.scheduleID}`,
    data,
  });
};

export const deleteSchedule = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};

export const querySchedule = (query: ScheduleQuery) => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    params: {
      ...query,
    },
  });
};
