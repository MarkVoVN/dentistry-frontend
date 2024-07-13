import { request } from "../utils/axios.config";
export type ClinicScheduleCreateModel = {
  clinicId: string;
  dayOfWeek: string;
  slotDuration: string;
  openingHours: string;
  closingHours: string;
  maxPatientsPerSlot: number;
};
export type ClinicScheduleModel = ClinicScheduleCreateModel & {
  id?: string;
  scheduleId?: string;
};

export const fetchClinicScheduleList = () => {
  return request({
    method: "GET",
    url: `/clinicSchedule`,
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
  console.log(data);
  return request({
    method: "PUT",
    url: `/clinicSchedule`,
    params: {
      id: data.id,
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
