import { request } from "../utils/axios.config";

export const loginUser = (data: { username: string; password: string }) => {
  return request({
    method: "POST",
    url: `/account/login`,
    data,
  });
};

export const refreshToken = async (refreshToken: string) => {
  return await request({
    method: "POST",
    url: `/account/refresh`,
    data: {
      refreshToken: refreshToken,
    },
  });
};
