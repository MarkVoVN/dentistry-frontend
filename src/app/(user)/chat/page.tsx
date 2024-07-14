"use client";
import React, { useEffect, useState } from "react";

import "./ChatComponent.css";
import ChatSearch from "./chatSearch";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import useSignalRChat from "./chatService";

const ChatComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    userId,
    dentist,
    setDentist,
    receivers,
    messages,
    receiverId,
    setReceiverId,
    handleSetReceiver,
    receiverName,
    handleSendMessage,
    setNewMessage,
    newMessage,
  } = useSignalRChat();

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

  if (receiverId === undefined) return <></>;
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
                  onClick={() => {
                    localStorage.setItem("receiverId", receiverId!);
                    handleSetReceiver(user.id, user.name);
                  }}
                  className={`w-full ${
                    receiverId === user.id ? "bg-secondary-200" : "bg-gray-300"
                  }`}
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
              onClick={() => {
                handleSendMessage();
              }}
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
