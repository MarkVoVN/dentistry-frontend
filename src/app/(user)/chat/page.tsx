"use client";
import React, { useEffect, useState } from "react";

import "./ChatComponent.css";
import ChatSearch from "./chatSearch";
import {
  MessageModel,
  ReceiverModel,
  createMessage,
  getMessagesById,
  getReceivers,
} from "@/lib/api/chatAPI";
import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { DentistModel } from "@/lib/api/dentistAPI";

const ChatComponent: React.FC = () => {
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
    if (!userId) return;
    const req = getReceivers(userId);
    req.then((res) => {
      setReceivers(res.data);
      console.log(res.data);
    });
  }, [userId, receiverId]);

  useEffect(() => {
    const req = getMessagesById(userId, receiverId);
    req.then((res) => {
      setMessages(res.data);
      console.log(res.data);
    });
  }, [userId, receiverId, dentist]);

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
        setOpen((prevOpen) => !prevOpen);
        console.log("Open chat");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
    try {
      if (connection && message.length > 0) {
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

  const handleSetReceiver = (id: string, name: string) => {
    setReceiverName(name);
    setReceiverId(id);
  };

  return (
    <>
      <ChatSearch
        setReceiverId={setReceiverId}
        open={open}
        setOpen={setOpen}
        setDentist={setDentist}
      />
      <div className="flex h-[calc(100vh-64px)] container mx-auto">
        {/* Left Column: List of users */}
        <aside className="w-1/4 border-r ">
          <h2 className="text-lg font-semibold mt-2">Messages</h2>
          <ul className="space-y-0">
            {receivers.map((user) => (
              <li key={user.id}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => handleSetReceiver(user.id, user.name)}
                  className="bg-gray-300 w-full"
                >
                  {user.name}
                </Button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Column: Chat window */}
        <div className="flex flex-col w-3/4">
          <header className="flex items-center justify-between px-4 py-2 border-b">
            {dentist ? (
              <h1 className="text-lg font-semibold">{dentist.name}</h1>
            ) : receiverName ? (
              <h1 className="text-lg font-semibold">{receiverName}</h1>
            ) : (
              <h1 className="text-lg font-semibold">Message</h1>
            )}

            <Button variant="outline" size="sm">
              Leave Chat
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={
                    message.senderID === userId
                      ? "flex items-end justify-end space-x-2"
                      : "flex items-end space-x-2"
                  }
                >
                  <div
                    className={
                      message.senderID === userId
                        ? "p-2 rounded-lg bg-secondary-900 dark:bg-gray-800"
                        : "p-2 rounded-lg bg-neutral-8 dark:bg-gray-700"
                    }
                  >
                    <p className="text-sm text-secondary-100">
                      {message.messageContent}
                    </p>
                  </div>
                </div>
              );
            })}
          </main>
          <footer className="flex items-center space-x-2 p-2 border-t">
            <Input
              className="flex-1"
              placeholder="Press / to open chat"
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!receiverId}
              value={newMessage}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              disabled={!receiverId || newMessage.length === 0}
            >
              Send
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
