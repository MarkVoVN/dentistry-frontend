import { request } from "../utils/axios.config";

export const fetchObjList = () => {
  return request({
    method: "GET",
    url: `/ObjRoute`,
  });
};

export const getObjById = (id: string) => {
  return request({
    method: "GET",
    url: `/ObjRoute/${id}`,
  });
};

export const createObj = (data: any) => {
  return request({
    method: "POST",
    url: `/ObjRoute`,
    data,
  });
};

export const updateObj = (id: string, data: any) => {
  return request({
    method: "PUT",
    url: `/ObjRoute/${id}`,
    data,
  });
};

export const deleteObj = (id: string) => {
  return request({
    method: "DELETE",
    url: `/ObjRoute/${id}`,
  });
};
