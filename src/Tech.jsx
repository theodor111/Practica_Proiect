import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ChatWidget from "./ChatWidget";

const categorii = ["Conferință", "Workshop", "Webinar", "Hackathon", "Expo", "Networking", "Lansare Produs", "Altele"];

function Tech() {
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [categorieActiva, setCategorieActiva] = useState("Toate");
    const [evenimente, setEvenimente] = useState([]);
    const [erori, setErori] = useState({});

    const [formular, setFormular] = useState({
        titlu: "",
        categorie: "Conferință",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    useEffect(() => {
        const evenimenteSalvate = localStorage.getItem("evenimenteTech");
        if (evenimenteSalvate) {
            setEvenimente(JSON.parse(evenimenteSalvate));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("evenimenteTech", JSON.stringify(evenimente));
    }, [evenimente]);

    const schimbaCamp = (e) => {
        const { name, value } = e.target;
        setFormular({ ...formular, [name]: value });
        setErori({ ...erori, [name]: "" });
    };

    const valideaza = () => {
        const eroriNoi = {};
        const regexData = /^\d{2}\.\d{2}\.\d{4}$/;
        const regexOra = /^\d{2}:\d{2}$/;

        if (!formular.titlu.trim())
            eroriNoi.titlu = "Titlul este obligatoriu.";

        if (!formular.data.trim())
            eroriNoi.data = "Data este obligatorie.";
        else if (!regexData.test(formular.data))
            eroriNoi.data = "Formatul corect este ZZ.LL.AAAA (ex: 10.09.2026).";

        if (!formular.ora.trim())
            eroriNoi.ora = "Ora este obligatorie.";
        else if (!regexOra.test(formular.ora))
            eroriNoi.ora = "Formatul corect este HH:MM (ex: 09:00).";

        if (!formular.locatie.trim())
            eroriNoi.locatie = "Locația este obligatorie.";

        if (formular.cost && !/^[0-9a-zA-ZăâîșțĂÂÎȘȚ\s\/]+$/.test(formular.cost))
            eroriNoi.cost = "Costul poate conține doar cifre, litere sau 'Gratuit'.";

        return eroriNoi;
    };

    const adaugaEveniment = (e) => {
        e.preventDefault();
        const eroriGasite = valideaza();
        if (Object.keys(eroriGasite).length > 0) {
            setErori(eroriGasite);
            return;
        }
        const evenimentNou = {
            id: Date.now(),
            ...formular,
            imagine: "TECHcard.png"
        };
        setEvenimente([evenimentNou, ...evenimente]);
        setFormular({ titlu: "", categorie: "Conferință", data: "", ora: "", locatie: "", cost: "", descriere: "" });
        setErori({});
        setAfiseazaFormular(false);
    };

    const stergeEveniment = (id) => {
        setEvenimente(evenimente.filter((e) => e.id !== id));
    };

    const evenimenteFiltrate =
        categorieActiva === "Toate" ? evenimente : evenimente.filter((e) => e.categorie === categorieActiva);

    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/">HOME</Link>
                    <Link to="/concerte">CONCERTS</Link>
                    <Link to="/festivaluri">FESTIVALS</Link>
                    <Link to="/sport">SPORTS</Link>
                    <Link to="/tech" className="active">TECH</Link>
                    <Link to="/workshops">WORKSHOPS</Link>
                    <Link to="/theater">THEATER</Link>
                    <Link to="/nightlife">NIGHTLIFE</Link>
                    <Link to="/art">ART</Link>
                    <a href="#" className="active">CONT</a>
                </nav>
            </header>

            <main>
                <section className="hero concerts-hero" style={{backgroundImage: "url('/TECHhome.png')"}}>
                    <div className="hero-content">
                        <h1>EVENIMENTE TECH<br />ÎN BRAȘOV</h1>
                        <p>- Descoperă conferințe, expoziții și webinare despre inovație și tehnologie.</p>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setAfiseazaFormular(!afiseazaFormular)}
                            >
                                {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ EVENIMENT TECH"}
                            </button>
                            <a href="#tech-lista" className="btn btn-outline">VEZI EVENIMENTE</a>
                        </div>
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-tech">
                        <h2>ADAUGĂ EVENIMENT TECH</h2>
                        <form className="event-form" onSubmit={adaugaEveniment}>
                            <div className="form-group">
                                <label>Titlul evenimentului *</label>
                                <input type="text" name="titlu" placeholder="Ex: BrașovTech Summit 2026" value={formular.titlu} onChange={schimbaCamp} />
                                {erori.titlu && <p className="eroare">{erori.titlu}</p>}
                            </div>
                            <div className="form-group">
                                <label>Tip eveniment *</label>
                                <select name="categorie" value={formular.categorie} onChange={schimbaCamp}>
                                    {categorii.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Data *</label>
                                    <input type="text" name="data" placeholder="Ex: 10.09.2026" value={formular.data} onChange={schimbaCamp} />
                                    {erori.data && <p className="eroare">{erori.data}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Ora *</label>
                                    <input type="text" name="ora" placeholder="Ex: 09:00" value={formular.ora} onChange={schimbaCamp} />
                                    {erori.ora && <p className="eroare">{erori.ora}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Locația *</label>
                                <input type="text" name="locatie" placeholder="Ex: Centrul de Afaceri Brașov" value={formular.locatie} onChange={schimbaCamp} />
                                {erori.locatie && <p className="eroare">{erori.locatie}</p>}
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input type="text" name="cost" placeholder="Ex: Gratuit / 200 lei" value={formular.cost} onChange={schimbaCamp} />
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

                {evenimente.length > 0 && (
                    <section className="categories" id="tech-lista">
                        <h2>EVENIMENTE TECH ADĂUGATE</h2>
                        <div className="filter-menu">
                            <button type="button" className={categorieActiva === "Toate" ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva("Toate")}>Toate</button>
                            {categorii.map((cat) => (
                                <button type="button" key={cat} className={categorieActiva === cat ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva(cat)}>{cat}</button>
                            ))}
                        </div>
                        {evenimenteFiltrate.length > 0 && (
                            <div className="grid">
                                {evenimenteFiltrate.map((ev) => (
                                    <div className="card event-card" key={ev.id}>
                                        <div className="card-img-container">
                                            <img src={ev.imagine} alt={ev.titlu} className="card-img-real" />
                                        </div>
                                        <div className="card-body event-card-body">
                                            <h3>{ev.titlu}</h3>
                                            <p className="event-category">{ev.categorie}</p>
                                            <div className="event-details">
                                                <p><strong>Data:</strong> {ev.data}</p>
                                                <p><strong>Ora:</strong> {ev.ora}</p>
                                                <p><strong>Locație:</strong> {ev.locatie}</p>
                                                {ev.cost && <p><strong>Cost:</strong> {ev.cost}</p>}
                                            </div>
                                            {ev.descriere && <p className="event-description">{ev.descriere}</p>}
                                            <div className="event-actions">
                                                <button className="btn-card">Vezi detalii</button>
                                                <button type="button" className="delete-btn" onClick={() => stergeEveniment(ev.id)}>Șterge</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
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
                    <a href="/Termeni si conditii.pdf" className="terms-link">TERMENI ȘI CONDIȚII</a>
                </div>
            </footer>
            <ChatWidget currentUser="Anonim" currentEventId="tech" />
        </div>
    );
}

export default Tech;