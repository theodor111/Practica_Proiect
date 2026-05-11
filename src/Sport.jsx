import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ChatWidget from "./ChatWidget";
import { useUserRole } from './useUserRole'; // Importăm hook-ul de roluri

// IMPORTURILE FIREBASE
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const categorii = ["Fotbal", "Baschet", "Handbal", "Fitness", "Tenis", "Alergare", "Altele"];

function Sport() {
    const { rol } = useUserRole(); // Extragem rolul utilizatorului
    const [afiseazaFiltru, setAfiseazaFiltru] = useState(false);
    const [sortare, setSortare] = useState("recente");
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [categorieActiva, setCategorieActiva] = useState("Toate");
    const [evenimente, setEvenimente] = useState([]);
    const [erori, setErori] = useState({});

    const [formular, setFormular] = useState({
        titlu: "",
        categorie: "Fotbal",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    // 1. CITIREA ȘI ȘTERGEREA AUTOMATĂ A EVENIMENTELOR EXPIRATE
    useEffect(() => {
        const fetchEvenimente = async () => {
            try {
                const azi = new Date();
                azi.setHours(0, 0, 0, 0);

                // Cerem din Firebase doar categoria "Sport"
                const q = query(collection(db, "evenimente"), where("categorie", "==", "Sport"));
                const querySnapshot = await getDocs(q);
                
                const evenimenteValabile = [];

                for (const document of querySnapshot.docs) {
                    const eveniment = { id: document.id, ...document.data() };
                    
                    const [zi, luna, an] = eveniment.data.split('.');
                    const dataEveniment = new Date(`${an}-${luna}-${zi}T00:00:00`);

                    if (dataEveniment < azi) {
                        // Ștergem evenimentul dacă data a trecut
                        await deleteDoc(doc(db, "evenimente", eveniment.id));
                        console.log(`Evenimentul sportiv expirat "${eveniment.titlu}" a fost șters automat.`);
                    } else {
                        evenimenteValabile.push(eveniment);
                    }
                }
                
                setEvenimente(evenimenteValabile);
            } catch (error) {
                console.error("Eroare la citirea evenimentelor sportive: ", error);
            }
        };

        fetchEvenimente();
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
        else if (!regexData.test(formular.data)) eroriNoi.data = "Formatul corect este ZZ.LL.AAAA (ex: 27.05.2026).";
        if (!formular.ora.trim()) eroriNoi.ora = "Ora este obligatorie.";
        else if (!regexOra.test(formular.ora)) eroriNoi.ora = "Formatul corect este HH:MM (ex: 15:00).";
        if (!formular.locatie.trim()) eroriNoi.locatie = "Locația este obligatorie.";
        if (formular.cost && !/^[0-9a-zA-ZăâîșțĂÂÎȘȚ\s\/]+$/.test(formular.cost)) eroriNoi.cost = "Costul poate conține doar cifre, litere sau 'Gratuit'.";

        return eroriNoi;
    };

    // 2. ADĂUGAREA UNUI EVENIMENT SPORTIV NOU
    const adaugaEveniment = async (e) => {
        e.preventDefault();
        const eroriGasite = valideaza();
        if (Object.keys(eroriGasite).length > 0) {
            setErori(eroriGasite);
            return;
        }
        
        try {
            const documentNou = {
                ...formular,
                tip_sport: formular.categorie, // Salvăm sportul (ex: Fotbal)
                categorie: "Sport", // Salvăm secțiunea principală pentru Firebase
                imagine: "EvSp.png",
                data_adaugare: new Date().getTime() 
            };

            const docRef = await addDoc(collection(db, "evenimente"), documentNou);

            const evenimentNou = { id: docRef.id, ...documentNou };
            setEvenimente([evenimentNou, ...evenimente]);
            
            setFormular({ titlu: "", categorie: "Fotbal", data: "", ora: "", locatie: "", cost: "", descriere: "" });
            setErori({});
            setAfiseazaFormular(false);
        } catch (error) {
            console.error("Eroare la adăugarea evenimentului: ", error);
        }
    };

    // 3. ȘTERGEREA MANUALĂ (DOAR PENTRU ORGANIZATOR)
    const stergeEveniment = async (id) => {
        try {
            await deleteDoc(doc(db, "evenimente", id));
            setEvenimente(evenimente.filter((ev) => ev.id !== id));
        } catch (error) {
            console.error("Eroare la ștergerea evenimentului: ", error);
        }
    };

    // 4. FILTRARE ȘI SORTARE
    const evenimenteFiltrate = (() => {
        let lista = categorieActiva === "Toate" 
            ? [...evenimente] 
            : evenimente.filter((ev) => ev.tip_sport === categorieActiva);
        
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
                    <Link to="/sport" className="active">SPORTS</Link>
                    <Link to="/tech">TECH</Link>
                    <Link to="/workshops">WORKSHOPS</Link>
                    <Link to="/theater">THEATER</Link>
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
                        {[
                            { val: 'recente', label: '🕒 Cele mai recente' },
                            { val: 'az', label: '🔤 De la A–Z' },
                            { val: 'ore', label: '⏰ După oră' },
                        ].map(({ val, label }) => (
                            <button
                                key={val}
                                onClick={() => setSortare(val)}
                                style={{
                                    display: 'block', width: '100%', padding: '12px 16px', marginBottom: '10px', borderRadius: '10px', textAlign: 'left',
                                    background: sortare === val ? 'rgba(153,15,75,0.25)' : 'rgba(255,255,255,0.05)',
                                    border: sortare === val ? '1px solid #990f4b' : '1px solid rgba(255,255,255,0.1)',
                                    color: sortare === val ? 'white' : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', transition: 'all 0.2s ease'
                                }}
                            >
                                {label}
                            </button>
                        ))}

                        <button
                            onClick={() => setAfiseazaFiltru(false)}
                            style={{ marginTop: '10px', width: '100%', padding: '13px', background: '#990f4b', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Oswald, sans-serif', letterSpacing: '2px', fontSize: '0.95rem', cursor: 'pointer' }}
                        >
                            APLICĂ
                        </button>
                    </div>
                </div>
            )}

            <main>
                <section className="hero sport-hero" style={{backgroundImage: "url('/Spo.png')"}}>
                    <div className="hero-content">
                        <h1>EVENIMENTE SPORTIVE<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă evenimente sportive.</p>
                        <div className="btn-group">
                            {/* LOGICA DE ROLURI: ORGANIZATOR APROBAT */}
                            {rol === 'organizator' && (
                                <button type="button" className="btn btn-primary" onClick={() => setAfiseazaFormular(!afiseazaFormular)}>
                                    {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ EVENIMENT"}
                                </button>
                            )}
                            
                            {/* LOGICA DE ROLURI: VIZITATOR & ÎN AȘTEPTARE */}
                            {(rol === 'vizitator' || rol === 'in_asteptare') && (
                                <button type="button" className="btn btn-primary" onClick={() => setAfiseazaFiltru(true)}>
                                    FILTREAZĂ EVENIMENTE
                                </button>
                            )}

                            <a href="#sport-evenimente" className="btn btn-outline">VEZI EVENIMENTE</a>
                        </div>
                        
                        {/* MESAJ PENTRU ORGANIZATORI IN ASTEPTARE */}
                        {rol === 'in_asteptare' && (
                            <p style={{ color: '#ffb3cc', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', background: 'rgba(153,15,75,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid #990f4b' }}>
                                ⏳ Contul tău de organizator este în curs de validare de către un administrator.
                            </p>
                        )}
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-eveniment">
                        <h2>ADAUGĂ EVENIMENT SPORTIV</h2>
                        <form className="event-form" onSubmit={adaugaEveniment}>
                            <div className="form-group">
                                <label>Titlul evenimentului *</label>
                                <input type="text" name="titlu" placeholder="Ex: Meci de fotbal FC Brașov" value={formular.titlu} onChange={schimbaCamp} />
                                {erori.titlu && <p className="eroare">{erori.titlu}</p>}
                            </div>
                            <div className="form-group">
                                <label>Categoria *</label>
                                <select name="categorie" value={formular.categorie} onChange={schimbaCamp}>
                                    {categorii.map((categorie) => (<option key={categorie} value={categorie}>{categorie}</option>))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Data *</label>
                                    <input type="text" name="data" placeholder="Ex: 27.05.2026" value={formular.data} onChange={schimbaCamp} />
                                    {erori.data && <p className="eroare">{erori.data}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Ora *</label>
                                    <input type="text" name="ora" placeholder="Ex: 15:00" value={formular.ora} onChange={schimbaCamp} />
                                    {erori.ora && <p className="eroare">{erori.ora}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Locația *</label>
                                <input type="text" name="locatie" placeholder="Ex: Stadionul Tineretului, Brașov" value={formular.locatie} onChange={schimbaCamp} />
                                {erori.locatie && <p className="eroare">{erori.locatie}</p>}
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input type="text" name="cost" placeholder="Ex: Gratuit / 50 lei" value={formular.cost} onChange={schimbaCamp} />
                                {erori.cost && <p className="eroare">{erori.cost}</p>}
                            </div>
                            <div className="form-group">
                                <label>Descriere</label>
                                <textarea name="descriere" placeholder="Scrie câteva detalii despre eveniment..." value={formular.descriere} onChange={schimbaCamp} />
                            </div>
                            <button type="submit" className="btn btn-primary">Salvează eveniment</button>
                        </form>
                    </section>
                )}

                <section className="categories" id="sport-evenimente">
                    <h2>EVENIMENTE SPORTIVE ADĂUGATE</h2>
                    <div className="filter-menu">
                        <button type="button" className={categorieActiva === "Toate" ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva("Toate")}>Toate</button>
                        {categorii.map((categorie) => (
                            <button type="button" key={categorie} className={categorieActiva === categorie ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva(categorie)}>{categorie}</button>
                        ))}
                    </div>
                    
                    {evenimenteFiltrate.length > 0 ? (
                        <div className="grid">
                            {evenimenteFiltrate.map((eveniment) => (
                                <div className="card event-card" key={eveniment.id}>
                                    <div className="card-img-container">
                                        <img src={eveniment.imagine} alt={eveniment.titlu} className="card-img-real" />
                                    </div>
                                    <div className="card-body event-card-body">
                                        <h3>{eveniment.titlu}</h3>
                                        {/* Aici afișăm tipul de sport */}
                                        <p className="event-category">{eveniment.tip_sport}</p>
                                        <div className="event-details">
                                            <p><strong>Data:</strong> {eveniment.data}</p>
                                            <p><strong>Ora:</strong> {eveniment.ora}</p>
                                            <p><strong>Locație:</strong> {eveniment.locatie}</p>
                                            {eveniment.cost && <p><strong>Cost:</strong> {eveniment.cost}</p>}
                                        </div>
                                        {eveniment.descriere && <p className="event-description">{eveniment.descriere}</p>}
                                        <div className="event-actions">
                                            <button className="btn-card">Vezi detalii</button>
                                            {/* DOAR ORGANIZATORUL POATE ȘTERGE */}
                                            {rol === 'organizator' && (
                                                <button type="button" className="delete-btn" onClick={() => stergeEveniment(eveniment.id)}>Șterge</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{textAlign: "center", color: "#aaa", marginTop: "20px"}}>Nu a fost găsit niciun eveniment sportiv momentan.</p>
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
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon-circle">f</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon-circle">ig</a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon-circle">t</a>
                    </div>
                </div>
                <div className="footer-section">
                    <p className="footer-title">CONTACT</p>
                    <Link to="/contact" className="terms-link">FORMULAR CONTACT</Link><br/>
                    <a href="/Termeni si conditii.pdf" className="terms-link">TERMENI ȘI CONDIȚII</a>
                </div>
            </footer>
            
            {/* CHAT WIDGET - Legat pe camera 'sport' */}
            <ChatWidget currentEventId="sport" />
        </div>
    );
}

export default Sport;