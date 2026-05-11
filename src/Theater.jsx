import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ChatWidget from "./ChatWidget";
import { useUserRole } from './useUserRole'; // Importăm hook-ul de roluri

// IMPORTURILE FIREBASE
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const categorii = ["Teatru Dramatic", "Comedie", "Musical", "Opera", "Balet", "Teatru Independent", "Spectacol Copii", "Altele"];

function Theater() {
    const { rol } = useUserRole(); // Extragem rolul utilizatorului
    const [afiseazaFiltru, setAfiseazaFiltru] = useState(false);
    const [sortare, setSortare] = useState("recente");
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [categorieActiva, setCategorieActiva] = useState("Toate");
    const [spectacole, setSpectacole] = useState([]);
    const [erori, setErori] = useState({});

    const [formular, setFormular] = useState({
        titlu: "",
        categorie: "Teatru Dramatic",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    // 1. CITIREA ȘI ȘTERGEREA AUTOMATĂ A SPECTACOLELOR EXPIRATE
    useEffect(() => {
        const fetchSpectacole = async () => {
            try {
                const azi = new Date();
                azi.setHours(0, 0, 0, 0);

                // Cerem din Firebase doar categoria "Theater"
                const q = query(collection(db, "evenimente"), where("categorie", "==", "Theater"));
                const querySnapshot = await getDocs(q);
                
                const spectacoleValabile = [];

                for (const document of querySnapshot.docs) {
                    const spectacol = { id: document.id, ...document.data() };
                    
                    const [zi, luna, an] = spectacol.data.split('.');
                    const dataSpectacol = new Date(`${an}-${luna}-${zi}T00:00:00`);

                    if (dataSpectacol < azi) {
                        // Ștergem automat dacă a trecut data
                        await deleteDoc(doc(db, "evenimente", spectacol.id));
                        console.log(`Spectacolul expirat "${spectacol.titlu}" a fost șters.`);
                    } else {
                        spectacoleValabile.push(spectacol);
                    }
                }
                
                setSpectacole(spectacoleValabile);
            } catch (error) {
                console.error("Eroare la citirea spectacolelor: ", error);
            }
        };

        fetchSpectacole();
    }, []);

    const schimbaCamp = (e) => {
        const { name, value } = e.target;
        setFormular({ ...formular, [name]: value });
        setErori({ ...erori, [name]: "" });
    };

    const valideaza = () => {
        const eroriNoi = {};
        const regexData = /^\d{2}\.\d{2}\.\d{4}$/;
        const regexOra = /^\d{2}:\d{2}$/;

        if (!formular.titlu.trim()) eroriNoi.titlu = "Titlul este obligatoriu.";
        if (!formular.data.trim()) eroriNoi.data = "Data este obligatorie.";
        else if (!regexData.test(formular.data)) eroriNoi.data = "Formatul corect este ZZ.LL.AAAA (ex: 05.06.2026).";
        if (!formular.ora.trim()) eroriNoi.ora = "Ora este obligatorie.";
        else if (!regexOra.test(formular.ora)) eroriNoi.ora = "Formatul corect este HH:MM (ex: 19:00).";
        if (!formular.locatie.trim()) eroriNoi.locatie = "Locația este obligatorie.";
        if (formular.cost && !/^[0-9a-zA-ZăâîșțĂÂÎȘȚ\s\/]+$/.test(formular.cost)) eroriNoi.cost = "Costul poate conține doar cifre, litere sau 'Gratuit'.";

        return eroriNoi;
    };

    // 2. ADĂUGAREA UNUI SPECTACOL NOU
    const adaugaSpectacol = async (e) => {
        e.preventDefault();
        const eroriGasite = valideaza();
        if (Object.keys(eroriGasite).length > 0) {
            setErori(eroriGasite);
            return;
        }
        
        try {
            const documentNou = {
                ...formular,
                tip_teatru: formular.categorie, // Salvăm tipul (Musical, etc.)
                categorie: "Theater", // Categoria principală
                imagine: "THEATERcard.png",
                data_adaugare: new Date().getTime() 
            };

            const docRef = await addDoc(collection(db, "evenimente"), documentNou);

            const spectacolNou = { id: docRef.id, ...documentNou };
            setSpectacole([spectacolNou, ...spectacole]);
            
            setFormular({ titlu: "", categorie: "Teatru Dramatic", data: "", ora: "", locatie: "", cost: "", descriere: "" });
            setErori({});
            setAfiseazaFormular(false);
        } catch (error) {
            console.error("Eroare la adăugarea spectacolului: ", error);
        }
    };

    // 3. ȘTERGEREA MANUALĂ (DOAR PENTRU ORGANIZATORI APROBAȚI)
    const stergeSpectacol = async (id) => {
        try {
            await deleteDoc(doc(db, "evenimente", id));
            setSpectacole(spectacole.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Eroare la ștergerea spectacolului: ", error);
        }
    };

    // 4. LOGICA FILTRARE ȘI SORTARE
    const spectacoleFiltrate = (() => {
        let lista = categorieActiva === "Toate" 
            ? [...spectacole] 
            : spectacole.filter((s) => s.tip_teatru === categorieActiva);
        
        if (sortare === "recente") {
            lista.sort((a, b) => (b.data_adaugare || 0) - (a.data_adaugare || 0));
        }
        else if (sortare === "az") {
            lista.sort((a, b) => a.titlu.localeCompare(b.titlu));
        }
        else if (sortare === "ore") {
            lista.sort((a, b) => a.ora.localeCompare(b.ora));
        }
        return lista;
    })();

    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/">HOME</Link>
                    <Link to="/concerte">CONCERTS</Link>
                    <Link to="/festivaluri">FESTIVALS</Link>
                    <Link to="/sport">SPORTS</Link>
                    <Link to="/tech">TECH</Link>
                    <Link to="/workshops">WORKSHOPS</Link>
                    <Link to="/theater" className="active">THEATER</Link>
                    <Link to="/nightlife">NIGHTLIFE</Link>
                    <Link to="/art">ART</Link>
                    <Link to="/login">CONT</Link>
                </nav>
            </header>

            {/* MODAL FILTRARE */}
            {afiseazaFiltru && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#121212', border: '1px solid #990f4b', borderRadius: '16px', padding: '32px', width: '340px', color: 'white', fontFamily: 'Montserrat, sans-serif' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '2px', margin: 0 }}>FILTREAZĂ</h3>
                            <button onClick={() => setAfiseazaFiltru(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                        </div>
                        <p style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>Sortare</p>
                        {[{ val: 'recente', label: '🕒 Cele mai recente' }, { val: 'az', label: '🔤 De la A–Z' }, { val: 'ore', label: '⏰ După oră' }].map(({ val, label }) => (
                            <button key={val} onClick={() => setSortare(val)} style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: '10px', borderRadius: '10px', textAlign: 'left', background: sortare === val ? 'rgba(153,15,75,0.25)' : 'rgba(255,255,255,0.05)', border: sortare === val ? '1px solid #990f4b' : '1px solid rgba(255,255,255,0.1)', color: sortare === val ? 'white' : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>{label}</button>
                        ))}
                        <button onClick={() => setAfiseazaFiltru(false)} style={{ marginTop: '10px', width: '100%', padding: '13px', background: '#990f4b', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Oswald, sans-serif', letterSpacing: '2px', cursor: 'pointer' }}>APLICĂ</button>
                    </div>
                </div>
            )}

            <main>
                <section className="hero concerts-hero" style={{backgroundImage: "url('/THEATERhome.png')"}}>
                    <div className="hero-content">
                        <h1>TEATRU & SPECTACOLE<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă spectacole de teatru, operă și balet din Brașov.</p>
                        <div className="btn-group">
                            {rol === 'organizator' && (
                                <button type="button" className="btn btn-primary" onClick={() => setAfiseazaFormular(!afiseazaFormular)}>
                                    {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ SPECTACOL"}
                                </button>
                            )}
                            {(rol === 'vizitator' || rol === 'in_asteptare') && (
                                <button type="button" className="btn btn-primary" onClick={() => setAfiseazaFiltru(true)}>FILTREAZĂ EVENIMENTE</button>
                            )}
                            <a href="#theater-lista" className="btn btn-outline">VEZI SPECTACOLE</a>
                        </div>
                        {rol === 'in_asteptare' && (
                            <p style={{ color: '#ffb3cc', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', background: 'rgba(153,15,75,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid #990f4b' }}>
                                ⏳ Cererea ta de organizator este în curs de validare.
                            </p>
                        )}
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-spectacol">
                        <h2>ADAUGĂ SPECTACOL</h2>
                        <form className="event-form" onSubmit={adaugaSpectacol}>
                            <div className="form-group">
                                <label>Titlul spectacolului *</label>
                                <input type="text" name="titlu" placeholder="Ex: Scrisoarea pierdută" value={formular.titlu} onChange={schimbaCamp} />
                                {erori.titlu && <p className="eroare">{erori.titlu}</p>}
                            </div>
                            <div className="form-group">
                                <label>Tip spectacol *</label>
                                <select name="categorie" value={formular.categorie} onChange={schimbaCamp}>
                                    {categorii.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Data *</label><input type="text" name="data" placeholder="Ex: 05.06.2026" value={formular.data} onChange={schimbaCamp} />{erori.data && <p className="eroare">{erori.data}</p>}</div>
                                <div className="form-group"><label>Ora *</label><input type="text" name="ora" placeholder="Ex: 19:00" value={formular.ora} onChange={schimbaCamp} />{erori.ora && <p className="eroare">{erori.ora}</p>}</div>
                            </div>
                            <div className="form-group"><label>Locația *</label><input type="text" name="locatie" placeholder="Teatru" value={formular.locatie} onChange={schimbaCamp} />{erori.locatie && <p className="eroare">{erori.locatie}</p>}</div>
                            <div className="form-group"><label>Cost</label><input type="text" name="cost" placeholder="Cost bilet" value={formular.cost} onChange={schimbaCamp} />{erori.cost && <p className="eroare">{erori.cost}</p>}</div>
                            <div className="form-group"><label>Descriere</label><textarea name="descriere" placeholder="Detalii" value={formular.descriere} onChange={schimbaCamp} /></div>
                            <button type="submit" className="btn btn-primary">Salvează spectacol</button>
                        </form>
                    </section>
                )}

                <section className="categories" id="theater-lista">
                    <h2>SPECTACOLE ADĂUGATE</h2>
                    <div className="filter-menu">
                        <button type="button" className={categorieActiva === "Toate" ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva("Toate")}>Toate</button>
                        {categorii.map((cat) => (
                            <button type="button" key={cat} className={categorieActiva === cat ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva(cat)}>{cat}</button>
                        ))}
                    </div>
                    
                    {spectacoleFiltrate.length > 0 ? (
                        <div className="grid">
                            {spectacoleFiltrate.map((spectacol) => (
                                <div className="card event-card" key={spectacol.id}>
                                    <div className="card-img-container"><img src={spectacol.imagine} alt={spectacol.titlu} className="card-img-real" /></div>
                                    <div className="card-body event-card-body">
                                        <h3>{spectacol.titlu}</h3>
                                        <p className="event-category">{spectacol.tip_teatru}</p>
                                        <div className="event-details">
                                            <p><strong>Data:</strong> {spectacol.data}</p>
                                            <p><strong>Ora:</strong> {spectacol.ora}</p>
                                            <p><strong>Locație:</strong> {spectacol.locatie}</p>
                                            {spectacol.cost && <p><strong>Cost:</strong> {spectacol.cost}</p>}
                                        </div>
                                        {spectacol.descriere && <p className="event-description">{spectacol.descriere}</p>}
                                        <div className="event-actions">
                                            <button className="btn-card">Vezi detalii</button>
                                            {rol === 'organizator' && (
                                                <button type="button" className="delete-btn" onClick={() => stergeSpectacol(spectacol.id)}>Șterge</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{textAlign: "center", color: "#aaa", marginTop: "20px"}}>Nu a fost găsit niciun spectacol.</p>
                    )}
                </section>
            </main>

            <footer>
                <div className="footer-section">
                    <div className="footer-links">
                        <a href="https://facebook.com">Facebook</a>
                        <a href="https://instagram.com">Instagram</a>
                        <a href="https://tiktok.com">Tiktok</a>
                    </div>
                </div>
                <div className="footer-section">
                    <p className="footer-title">SOCIAL MEDIA</p>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" className="icon-circle">f</a>
                        <a href="https://instagram.com" target="_blank" className="icon-circle">ig</a>
                        <a href="https://tiktok.com" target="_blank" className="icon-circle">t</a>
                    </div>
                </div>
                <div className="footer-section">
                    <p className="footer-title">CONTACT</p>
                    <Link to="/contact" className="terms-link">FORMULAR CONTACT</Link><br/>
                    <a href="/Termeni si conditii.pdf" className="terms-link">TERMENI ȘI CONDIȚII</a>
                </div>
            </footer>
            
            {/* CHAT LEGAT PE CAMERA 'theater' */}
            <ChatWidget currentEventId="theater" />
        </div>
    );
}

export default Theater;