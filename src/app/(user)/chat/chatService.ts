import { createMessage, MessageModel } from "@/lib/api/chatAPI";
import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DentistModel } from "@/lib/api/dentistAPI";
const SERVER_URL = "http://localhost:3000"; // Điều chỉnh URL của server SignalR của bạn

const useSignalRChat = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [userId, setUserId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [open, setOpen] = useState(false);
  const [dentist, setDentist] = useState<DentistModel | null>(null);
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
      .withUrl(`http://localhost:3000/chatHub`)
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

  const sendMessage = async (message: string) => {
    console.log(receiverId); // Log to see the value of receiverId
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
    try {
      if (connection) {
        await createMessage(messageDto);
        await connection.send("SendMessage", message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = () => {
    console.log(receiverId);
    sendMessage(newMessage);
    setNewMessage("");
  };
  return { messages, sendMessage, userId, setReceiverId, receiverId, dentist };
};

export default useSignalRChat;
