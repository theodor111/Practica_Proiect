import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MessageCircle, Send, X } from "lucide-react";

const socket = io("http://localhost:3001");

export default function ChatWidget({ currentUser, currentEventId }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", currentEventId);
  }, [currentEventId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      roomId: currentEventId,
      author: currentUser,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <>
      {/* CHAT WINDOW */}
      {open && (
        <div
          className="fixed bottom-6 right-6 w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col z-50"
          style={{ background: "#000000", border: "2px solid #ffffff" }}
        >

          {/* HEADER */}
          <div
            className="text-white p-3 flex justify-between items-center rounded-t-2xl"
            style={{ backgroundColor: "#990f4b" }}
          >
            <span className="font-semibold">Event Chat</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            className="flex-1 p-3 overflow-y-auto space-y-2"
            style={{ backgroundColor: "#000000" }}
          >
            {messages.map((msg, i) => {
              const isMine = msg.author === currentUser;
              return (
                <div
                  key={i}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="px-3 py-2 rounded-xl max-w-[75%] text-sm"
                    style={{
                      backgroundColor: isMine ? "#990f4b" : "#1a1a1a",
                      color: "#ffffff",
                      border: "1px solid #ffffff",
                    }}
                  >
                    {!isMine && (
                      <p className="text-xs font-bold" style={{ color: "#990f4b" }}>
                        {msg.author}
                      </p>
                    )}
                    {msg.message}
                    <p className="text-[10px] opacity-70 text-right">{msg.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div
            className="p-2 flex gap-2"
            style={{ borderTop: "1px solid #ffffff", backgroundColor: "#000000" }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Scrie mesaj..."
              className="flex-1 rounded-full px-3 py-1 text-sm"
              style={{
                background: "#1a1a1a",
                color: "#ffffff",
                border: "1px solid #ffffff",
              }}
            />
            <button
              onClick={sendMessage}
              className="text-white p-2 rounded-full"
              style={{ backgroundColor: "#990f4b" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-xl flex items-center justify-center z-50"
          style={{ backgroundColor: "#990f4b" }}
        >
          <MessageCircle size={26} />
        </button>
      )}
    </>
  );
}