import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

/* ─── Culori din tema principală ─────────────────────────────────────────── */
const PRIMARY   = '#990f4b';
const PRIMARY_D = '#7a0c3c';
const CARD_BG   = 'rgba(12, 5, 10, 0.75)';
const BORDER    = `1px solid rgba(153, 15, 75, 0.35)`;

export default function ContactForm() {
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" });
  const [status, setStatus]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Toate câmpurile sunt obligatorii!");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      await addDoc(collection(db, "contacts"), { ...formData, createdAt: Timestamp.now() });
      setStatus("Mesaj trimis cu succes! Te vom contacta în curând.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Eroare Firebase:", err);
      setStatus("Eroare la trimitere. Verifică setările Firestore.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Helpers style ──────────────────────────────────────────────────────── */
  const getInputStyle = (field) => ({
    width: "100%",
    padding: "12px 15px",
    background: "rgba(255,255,255,0.04)",
    border: focusField === field ? `1px solid ${PRIMARY}` : "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "white",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focusField === field ? `0 0 14px rgba(153,15,75,0.35)` : "none",
    boxSizing: "border-box",
  });

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", position: "relative" }}>

      {/* ── BACK ── */}
      <Link to="/" style={{ position: "fixed", top: "20px", left: "20px", color: "#ccc", fontFamily: "Oswald, sans-serif", fontSize: "0.85rem", letterSpacing: "1px", textDecoration: "none", transition: "0.3s", zIndex: 100, textTransform: "uppercase" }}
        onMouseEnter={(e) => { e.target.style.color = PRIMARY; }}
        onMouseLeave={(e) => { e.target.style.color = "#ccc"; }}>
        ← Back to Home
      </Link>

      {/* ── CARD ── */}
      <div style={{ background: CARD_BG, backdropFilter: "blur(22px)", border: BORDER, borderRadius: "20px", padding: "50px 40px", maxWidth: "450px", width: "100%", boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(153,15,75,0.1)`, animation: "fadeEntry 1s ease-out forwards", textAlign: "center", color: "#fff" }}>

        <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "2rem", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "6px", color: "white" }}>
          Contact
        </h2>
        <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "28px", fontFamily: "Montserrat, sans-serif" }}>
          Ai o întrebare? Trimite-ne un mesaj!
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>

          {/* NUME */}
          <div>
            <label style={{ fontFamily: "Oswald, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "8px" }}>Nume Complet</label>
            <input type="text" name="name" placeholder="Ion Popescu" value={formData.name} onChange={handleChange}
              style={getInputStyle("name")} onFocus={() => setFocusField("name")} onBlur={() => setFocusField(null)} required />
          </div>

          {/* EMAIL */}
          <div>
            <label style={{ fontFamily: "Oswald, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "8px" }}>Email</label>
            <input type="email" name="email" placeholder="ion@exemplu.com" value={formData.email} onChange={handleChange}
              style={getInputStyle("email")} onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)} required />
          </div>

          {/* MESAJ */}
          <div>
            <label style={{ fontFamily: "Oswald, sans-serif", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "8px" }}>Mesajul tău</label>
            <textarea name="message" placeholder="Scrie aici mesajul tău..." value={formData.message} onChange={handleChange}
              style={{ ...getInputStyle("message"), minHeight: "120px", resize: "none" }}
              onFocus={() => setFocusField("message")} onBlur={() => setFocusField(null)} required />
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "#555" : PRIMARY, color: "white", border: "none", borderRadius: "10px", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s ease", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) { e.target.style.background = PRIMARY_D; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 28px rgba(153,15,75,0.45)`; } }}
            onMouseLeave={(e) => { if (!loading) { e.target.style.background = PRIMARY; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; } }}>
            {loading ? "Se trimite..." : "Trimite mesaj"}
          </button>
        </form>

        {/* STATUS */}
        {status && (
          <p style={{ marginTop: "20px", padding: "12px", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 500, fontFamily: "Montserrat, sans-serif", color: status.includes("succes") ? "#ffb3cc" : "#ffb3cc", background: status.includes("succes") ? "rgba(153,15,75,0.12)" : "rgba(153,15,75,0.15)", border: `1px solid ${status.includes("succes") ? PRIMARY : '#cc0000'}` }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}