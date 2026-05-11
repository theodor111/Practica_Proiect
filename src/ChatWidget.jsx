import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebase"; 
import { MessageCircle, Send, X } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "firebase/firestore";

export default function ChatWidget({ currentEventId }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState("Anonim"); 
    const messagesEndRef = useRef(null);

    // 1. AFLĂ CINE ESTE UTILIZATORUL LOGAT ȘI NUMELE LUI
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                // Luăm numele din profil sau prima parte din email
                const name = user.displayName || user.email.split('@')[0];
                setUserName(name);
            } else {
                setUserName("Anonim");
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // 2. ASCULTĂ MESAJELE ÎN TIMP REAL
    useEffect(() => {
        if (!currentEventId) return;

        const q = query(
            collection(db, "chats"),
            where("roomId", "==", currentEventId),
            orderBy("createdAt", "asc")
        );

        const unsubscribeChat = onSnapshot(q, (snapshot) => {
            const loadedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(loadedMessages);
        }, (error) => {
            console.error("Eroare la citirea mesajelor. Verifică dacă ai creat Index-ul în Firebase!", error);
        });

        return () => unsubscribeChat();
    }, [currentEventId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // 3. TRIMITE MESAJUL
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await addDoc(collection(db, "chats"), {
                roomId: currentEventId,
                author: userName, 
                userId: auth.currentUser.uid,
                message: message.trim(),
                createdAt: serverTimestamp(),
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            });
            setMessage("");
        } catch (error) {
            console.error("Eroare la trimitere:", error);
        }
    };

    return (
        <>
            {open && (
                <div style={{ 
                    position: "fixed", 
                    bottom: "90px", 
                    right: "24px", 
                    width: "360px", 
                    height: "480px", 
                    background: "rgba(12, 5, 10, 0.85)", 
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px", 
                    border: "1px solid rgba(153, 15, 75, 0.4)", 
                    boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                    display: "flex", 
                    flexDirection: "column", 
                    zIndex: 10000,
                    overflow: "hidden",
                    animation: "fadeEntry 0.3s ease-out"
                }}>
                    
                    {/* HEADER */}
                    <div style={{ 
                        padding: "18px 20px", 
                        background: "linear-gradient(135deg, rgba(153, 15, 75, 0.8) 0%, rgba(12, 5, 10, 0) 100%)", 
                        borderBottom: "1px solid rgba(153, 15, 75, 0.3)",
                        color: "white", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center" 
                    }}>
                        <span style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "1px", fontSize: "1.1rem" }}>
                            CHAT: {currentEventId.toUpperCase()}
                        </span>
                        <X onClick={() => setOpen(false)} style={{ cursor: "pointer", color: "#ccc" }} />
                    </div>
                    
                    {/* LISTA MESAJE */}
                    <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {messages.length === 0 ? (
                            <p style={{ textAlign: "center", color: "#666", fontSize: "0.85rem", margin: "auto" }}>Fii primul care lasă un mesaj!</p>
                        ) : (
                            messages.map((msg) => {
                                const isMe = auth.currentUser && msg.userId === auth.currentUser.uid;
                                return (
                                    <div key={msg.id} style={{ 
                                        alignSelf: isMe ? "flex-end" : "flex-start",
                                        maxWidth: "80%",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "3px", alignSelf: isMe ? "flex-end" : "flex-start" }}>
                                            {isMe ? "Tu" : msg.author}
                                        </div>
                                        <div style={{ 
                                            background: isMe ? "#990f4b" : "rgba(255,255,255,0.1)",
                                            padding: "10px 14px", 
                                            borderRadius: "15px", 
                                            borderBottomRightRadius: isMe ? "2px" : "15px",
                                            borderBottomLeftRadius: !isMe ? "2px" : "15px",
                                            color: "white",
                                            fontSize: "0.9rem"
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: "9px", color: "#666", marginTop: "3px", textAlign: isMe ? "right" : "left" }}>
                                            {msg.time || "acum"}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* ZONA DE INPUT / AUTENTIFICARE */}
                    {auth.currentUser ? (
                        <form onSubmit={sendMessage} style={{ 
                            padding: "15px", 
                            display: "flex", 
                            gap: "8px", 
                            background: "rgba(0,0,0,0.3)",
                            borderTop: "1px solid rgba(153, 15, 75, 0.2)" 
                        }}>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                // RESTAURAT: Placeholder-ul personalizat
                                placeholder={`Scrie ca ${userName}...`}
                                style={{ 
                                    flex: 1, 
                                    padding: "10px 15px", 
                                    borderRadius: "20px", 
                                    border: "1px solid rgba(255,255,255,0.1)", 
                                    outline: "none", 
                                    background: "rgba(0,0,0,0.2)", 
                                    color: "white",
                                    fontSize: "0.9rem"
                                }}
                            />
                            <button type="submit" disabled={!message.trim()} style={{ 
                                background: "#990f4b", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "50%", 
                                width: "40px", 
                                height: "40px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: message.trim() ? 1 : 0.5
                            }}>
                                <Send size={18} />
                            </button>
                        </form>
                    ) : (
                        /* RESTAURAT: Blocul de autentificare pentru vizitatori */
                        <div style={{ 
                            padding: "20px", 
                            background: "rgba(0,0,0,0.4)", 
                            textAlign: "center", 
                            borderTop: "1px solid rgba(153, 15, 75, 0.4)" 
                        }}>
                            <p style={{ color: "#aaa", fontSize: "0.82rem", marginBottom: "10px", fontFamily: "Montserrat, sans-serif" }}>
                                Trebuie să fii autentificat pentru a trimite mesaje.
                            </p>
                            <a href="/login" style={{ 
                                color: "#ffb3cc", 
                                fontFamily: "Oswald, sans-serif", 
                                fontSize: "0.85rem", 
                                letterSpacing: "1px", 
                                textDecoration: "none",
                                fontWeight: "bold"
                            }}>
                                AUTENTIFICĂ-TE →
                            </a>
                        </div>
                    )}
                </div>
            )}

            {!open && (
                <button onClick={() => setOpen(true)} style={{ 
                    position: "fixed", 
                    bottom: "24px", 
                    right: "24px", 
                    width: "65px", 
                    height: "65px", 
                    borderRadius: "50%", 
                    background: "#990f4b", 
                    color: "white", 
                    border: "none", 
                    cursor: "pointer", 
                    zIndex: 10000,
                    boxShadow: "0 10px 25px rgba(153, 15, 75, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <MessageCircle size={30} />
                </button>
            )}
        </>
    );
}