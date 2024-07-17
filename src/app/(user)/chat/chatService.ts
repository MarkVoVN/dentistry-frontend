import {
  createMessage,
  getMessagesById,
  getReceivers,
  MessageModel,
  ReceiverModel,
} from "@/lib/api/chatAPI";
import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { use, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DentistModel } from "@/lib/api/dentistAPI";

const useSignalRChat = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [userId, setUserId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [open, setOpen] = useState(false);
  const [dentist, setDentist] = useState<DentistModel | null>(null);
  const [receivers, setReceivers] = useState<ReceiverModel[]>([]);
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    setReceiverId(localStorage.getItem("receiverId") || "");
  }, []);
  useEffect(() => {
    if (!userId && !receiverId) return;
    const req = getMessagesById(userId, receiverId);
    req.then((res) => {
      setMessages(res.data);
    });
  }, [userId, receiverId, dentist]);

  useEffect(() => {
    if (!userId) return;
    const req = getReceivers(userId);
    req.then((res) => {
      setReceivers(res.data);
    });
  }, [userId, receiverId]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded: any = jwt.decode(token);
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://dentistry.api.markvoit.id.vn/chatHub`, {})
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected!");
          connection.on("ReceiveMessage", (message: MessageModel) => {
            console.log(message);
            setMessages((currentMessages) => [...currentMessages, message]);
            console.log("Received Message");
          });
        })
        .catch((error) => console.error("SignalR Connection Error:", error));
    }
  }, [connection]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        setOpen(true);
        console.log("Open chat");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleSetReceiver = (id: string, name: string) => {
    setReceiverName(name);
    setReceiverId(id);
  };
  const sendMessage = async (message: string) => {
    if (!receiverId) {
      console.error("Receiver ID is not set!");
      return;
    }
    const messageDto = {
      senderID: userId,
      receiverID: receiverId,
      messageContent: message,
      timestamp: new Date().toISOString(),
    };
    console.log(messageDto);
    try {
      if (connection && message.length > 0) {
        await createMessage(messageDto);
        await connection.send("SendMessage", message);
        console.log("Message sent successfully");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  return {
    messages,
    sendMessage,
    userId,
    setReceiverId,
    receiverId,
    dentist,
    setDentist,
    receivers,
    receiverName,
    handleSetReceiver,
    handleSendMessage,
    setNewMessage,
    newMessage,
  };
};

export default useSignalRChat;
