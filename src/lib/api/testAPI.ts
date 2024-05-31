import { request } from "@/lib/utils/axios.config";

export const getTodoList = () => {
  // console.log("GET SENDING");
  return request({
    method: "GET",
    url: `/test`,
  });
};
export const postTodo = (data: { id: number; title: string | undefined }) => {
  // console.log("POST SENDING");

  return request({
    method: "POST",
    url: `/test`,
    data,
  });
};
