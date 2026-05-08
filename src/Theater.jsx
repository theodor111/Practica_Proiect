import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ChatWidget from "./ChatWidget";

const categorii = ["Teatru Dramatic", "Comedie", "Musical", "Opera", "Balet", "Teatru Independent", "Spectacol Copii", "Altele"];

function Theater() {
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

    useEffect(() => {
        const spectacoleSalvate = localStorage.getItem("spectacoleAdaugate");
        if (spectacoleSalvate) {
            setSpectacole(JSON.parse(spectacoleSalvate));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("spectacoleAdaugate", JSON.stringify(spectacole));
    }, [spectacole]);

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
            eroriNoi.data = "Formatul corect este ZZ.LL.AAAA (ex: 05.06.2026).";

        if (!formular.ora.trim())
            eroriNoi.ora = "Ora este obligatorie.";
        else if (!regexOra.test(formular.ora))
            eroriNoi.ora = "Formatul corect este HH:MM (ex: 19:00).";

        if (!formular.locatie.trim())
            eroriNoi.locatie = "Locația este obligatorie.";

        if (formular.cost && !/^[0-9a-zA-ZăâîșțĂÂÎȘȚ\s\/]+$/.test(formular.cost))
            eroriNoi.cost = "Costul poate conține doar cifre, litere sau 'Gratuit'.";

        return eroriNoi;
    };

    const adaugaSpectacol = (e) => {
        e.preventDefault();
        const eroriGasite = valideaza();
        if (Object.keys(eroriGasite).length > 0) {
            setErori(eroriGasite);
            return;
        }
        const spectacolNou = {
            id: Date.now(),
            ...formular,
            imagine: "THEATERcard.png"
        };
        setSpectacole([spectacolNou, ...spectacole]);
        setFormular({ titlu: "", categorie: "Teatru Dramatic", data: "", ora: "", locatie: "", cost: "", descriere: "" });
        setErori({});
        setAfiseazaFormular(false);
    };

    const stergeSpectacol = (id) => {
        setSpectacole(spectacole.filter((s) => s.id !== id));
    };

    const spectacoleFiltrate =
        categorieActiva === "Toate" ? spectacole : spectacole.filter((s) => s.categorie === categorieActiva);

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
                    <a href="#" className="active">CONT</a>
                </nav>
            </header>

            <main>
                <section className="hero concerts-hero" style={{backgroundImage: "url('/THEATERhome.png')"}}>
                    <div className="hero-content">
                        <h1>TEATRU & SPECTACOLE<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă spectacole de teatru, operă și balet din Brașov.</p>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setAfiseazaFormular(!afiseazaFormular)}
                            >
                                {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ SPECTACOL"}
                            </button>
                            <a href="#theater-lista" className="btn btn-outline">VEZI SPECTACOLE</a>
                        </div>
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
                                <div className="form-group">
                                    <label>Data *</label>
                                    <input type="text" name="data" placeholder="Ex: 05.06.2026" value={formular.data} onChange={schimbaCamp} />
                                    {erori.data && <p className="eroare">{erori.data}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Ora *</label>
                                    <input type="text" name="ora" placeholder="Ex: 19:00" value={formular.ora} onChange={schimbaCamp} />
                                    {erori.ora && <p className="eroare">{erori.ora}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Locația *</label>
                                <input type="text" name="locatie" placeholder="Ex: Teatrul Sică Alexandrescu, Brașov" value={formular.locatie} onChange={schimbaCamp} />
                                {erori.locatie && <p className="eroare">{erori.locatie}</p>}
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input type="text" name="cost" placeholder="Ex: 50 lei / loc" value={formular.cost} onChange={schimbaCamp} />
                                {erori.cost && <p className="eroare">{erori.cost}</p>}
                            </div>
                            <div className="form-group">
                                <label>Descriere</label>
                                <textarea name="descriere" placeholder="Scrie câteva detalii despre spectacol..." value={formular.descriere} onChange={schimbaCamp} />
                            </div>
                            <button type="submit" className="btn btn-primary">Salvează spectacol</button>
                        </form>
                    </section>
                )}

                {spectacole.length > 0 && (
                    <section className="categories" id="theater-lista">
                        <h2>SPECTACOLE ADĂUGATE</h2>
                        <div className="filter-menu">
                            <button type="button" className={categorieActiva === "Toate" ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva("Toate")}>Toate</button>
                            {categorii.map((cat) => (
                                <button type="button" key={cat} className={categorieActiva === cat ? "filter-btn active-filter" : "filter-btn"} onClick={() => setCategorieActiva(cat)}>{cat}</button>
                            ))}
                        </div>
                        {spectacoleFiltrate.length > 0 && (
                            <div className="grid">
                                {spectacoleFiltrate.map((spectacol) => (
                                    <div className="card event-card" key={spectacol.id}>
                                        <div className="card-img-container">
                                            <img src={spectacol.imagine} alt={spectacol.titlu} className="card-img-real" />
                                        </div>
                                        <div className="card-body event-card-body">
                                            <h3>{spectacol.titlu}</h3>
                                            <p className="event-category">{spectacol.categorie}</p>
                                            <div className="event-details">
                                                <p><strong>Data:</strong> {spectacol.data}</p>
                                                <p><strong>Ora:</strong> {spectacol.ora}</p>
                                                <p><strong>Locație:</strong> {spectacol.locatie}</p>
                                                {spectacol.cost && <p><strong>Cost:</strong> {spectacol.cost}</p>}
                                            </div>
                                            {spectacol.descriere && <p className="event-description">{spectacol.descriere}</p>}
                                            <div className="event-actions">
                                                <button className="btn-card">Vezi detalii</button>
                                                <button type="button" className="delete-btn" onClick={() => stergeSpectacol(spectacol.id)}>Șterge</button>
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
            <ChatWidget currentUser="Anonim" currentEventId="theater" />
        </div>
    );
}

export default Theater;