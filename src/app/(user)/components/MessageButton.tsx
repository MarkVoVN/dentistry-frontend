'use client';
import { MessageCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageButton() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/chat")}
      className="fixed bottom-4 right-4 bg-secondary-800 text-white p-4 rounded-full shadow-lg cursor-pointer"
    >
      <MessageSquare fill="#fff" stroke="#fff" className="w-8 h-8 text-white" />
    </div>
  );
}
