import { request } from "../utils/axios.config";

export const loginUser = (data: { id: number; title: string | undefined }) => {
  // console.log("POST SENDING");

  return request({
    method: "POST",
    url: `/login`,
    data,
  });
};
