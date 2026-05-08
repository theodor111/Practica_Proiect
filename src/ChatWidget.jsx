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
            message: message.trim(),
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
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        width: "390px",
                        height: "560px",
                        background: "#0b0b0f",
                        borderRadius: "24px",
                        overflow: "hidden",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid rgba(255,255,255,0.14)",
                        boxShadow: "0 25px 70px rgba(0,0,0,0.75)",
                    }}
                >
                    {/* HEADER */}
                    <div
                        style={{
                            height: "64px",
                            padding: "0 18px",
                            background: "linear-gradient(135deg, #b0125b, #7a0c3c)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid rgba(255,255,255,0.12)",
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "800",
                                    letterSpacing: "0.3px",
                                }}
                            >
                                Event Chat
                            </span>

                            <span
                                style={{
                                    fontSize: "11px",
                                    opacity: 0.8,
                                    marginTop: "2px",
                                }}
                            >
                                Discuții live despre eveniment
                            </span>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                border: "1px solid rgba(255,255,255,0.18)",
                                background: "rgba(255,255,255,0.13)",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* MESSAGES */}
                    <div
                        style={{
                            flex: 1,
                            padding: "18px",
                            overflowY: "auto",
                            background:
                                "radial-gradient(circle at top right, rgba(153,15,75,0.20), transparent 34%), #0b0b0f",
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.45)",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    padding: "0 30px",
                                }}
                            >
                                Nu există mesaje încă. Începe conversația.
                            </div>
                        )}

                        {messages.map((msg, i) => {
                            const isMine = msg.author === currentUser;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: isMine ? "flex-end" : "flex-start",
                                        marginBottom: "14px",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "76%",
                                            background: isMine
                                                ? "linear-gradient(135deg, #c01666, #8a0e47)"
                                                : "#1a1a22",
                                            color: "#ffffff",
                                            borderRadius: isMine
                                                ? "18px 18px 6px 18px"
                                                : "18px 18px 18px 6px",
                                            padding: "11px 14px 8px",
                                            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                                            border: "1px solid rgba(255,255,255,0.10)",
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        {!isMine && (
                                            <p
                                                style={{
                                                    margin: "0 0 5px",
                                                    fontSize: "11px",
                                                    fontWeight: "700",
                                                    color: "#ff5ba5",
                                                }}
                                            >
                                                {msg.author}
                                            </p>
                                        )}

                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "14px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {msg.message}
                                        </p>

                                        <p
                                            style={{
                                                margin: "6px 0 0",
                                                fontSize: "10px",
                                                opacity: 0.65,
                                                textAlign: "right",
                                            }}
                                        >
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
                    <div
                        style={{
                            padding: "14px 16px 16px",
                            background: "#0b0b0f",
                            borderTop: "1px solid rgba(255,255,255,0.10)",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                background: "#15151c",
                                border: "1px solid rgba(255,255,255,0.14)",
                                borderRadius: "999px",
                                padding: "8px 8px 8px 16px",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                            }}
                        >
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Scrie un mesaj..."
                                style={{
                                    flex: 1,
                                    height: "32px",
                                    background: "transparent",
                                    color: "#ffffff",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                            />

                            <button
                                onClick={sendMessage}
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "linear-gradient(135deg, #ff2f86, #990f4b)",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 6px 16px rgba(153,15,75,0.45)",
                                    flexShrink: 0,
                                }}
                            >
                                <Send size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        width: "58px",
                        height: "58px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "linear-gradient(135deg, #ff2f86, #990f4b)",
                        color: "#ffffff",
                        boxShadow: "0 12px 30px rgba(153,15,75,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 9999,
                    }}
                >
                    <MessageCircle size={27} />
                </button>
            )}
        </>
    );
}