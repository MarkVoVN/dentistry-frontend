import { request } from "../utils/axios.config";

export type MessageModel = {
  senderID: string;
  receiverID: string;
  messageContent: string;
  timestamp: Date;
};

export const createMessage = (data: any) => {
  return request({
    method: "POST",
    url: `/chatmessage`,
    data,
  });
};

export const getMessagesById = (senderId: string, receiverId: string) => {
  return request({
    method: "GET",
    url: `/chatmessage/sender/${senderId}/receiver/${receiverId}`,
  });
};
