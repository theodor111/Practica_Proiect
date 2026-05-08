import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ChatWidget from "./ChatWidget";

const genuri = ["Rock", "Electronic", "Pop", "Folk", "Jazz", "Metal", "World Music", "Altele"];

function Festivaluri() {
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [genActiv, setGenActiv] = useState("Toate");
    const [festivaluri, setFestivaluri] = useState([]);
    const [erori, setErori] = useState({});

    const [formular, setFormular] = useState({
        titlu: "",
        gen: "Rock",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    useEffect(() => {
        const festivaluriSalvate = localStorage.getItem("festivaluriAdaugate");
        if (festivaluriSalvate) {
            setFestivaluri(JSON.parse(festivaluriSalvate));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("festivaluriAdaugate", JSON.stringify(festivaluri));
    }, [festivaluri]);

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
            eroriNoi.data = "Formatul corect este ZZ.LL.AAAA (ex: 15.07.2026).";

        if (!formular.ora.trim())
            eroriNoi.ora = "Ora este obligatorie.";
        else if (!regexOra.test(formular.ora))
            eroriNoi.ora = "Formatul corect este HH:MM (ex: 16:00).";

        if (!formular.locatie.trim())
            eroriNoi.locatie = "Locația este obligatorie.";

        if (formular.cost && !/^[0-9a-zA-ZăâîșțĂÂÎȘȚ\s\/]+$/.test(formular.cost))
            eroriNoi.cost = "Costul poate conține doar cifre, litere sau 'Gratuit'.";

        return eroriNoi;
    };

    const adaugaFestival = (e) => {
        e.preventDefault();
        const eroriGasite = valideaza();
        if (Object.keys(eroriGasite).length > 0) {
            setErori(eroriGasite);
            return;
        }
        const festivalNou = {
            id: Date.now(),
            ...formular,
            imagine: "FESTIVALcard.png"
        };
        setFestivaluri([festivalNou, ...festivaluri]);
        setFormular({ titlu: "", gen: "Rock", data: "", ora: "", locatie: "", cost: "", descriere: "" });
        setErori({});
        setAfiseazaFormular(false);
    };

    const stergeFestival = (id) => {
        setFestivaluri(festivaluri.filter((f) => f.id !== id));
    };

    const festivaluriFiltrate =
        genActiv === "Toate" ? festivaluri : festivaluri.filter((f) => f.gen === genActiv);

    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/">HOME</Link>
                    <Link to="/concerte">CONCERTS</Link>
                    <Link to="/festivaluri" className="active">FESTIVALS</Link>
                    <Link to="/sport">SPORTS</Link>
                    <Link to="/tech">TECH</Link>
                    <Link to="/workshops">WORKSHOPS</Link>
                    <Link to="/theater">THEATER</Link>
                    <Link to="/nightlife">NIGHTLIFE</Link>
                    <Link to="/art">ART</Link>
                    <a href="#" className="active">CONT</a>
                </nav>
            </header>

            <main>
                <section className="hero concerts-hero" style={{backgroundImage: "url('/FESTIVALhome.png')"}}>
                    <div className="hero-content">
                        <h1>FESTIVALURI<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă festivaluri, artiști și experiențe de neuitat.</p>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setAfiseazaFormular(!afiseazaFormular)}
                            >
                                {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ FESTIVAL"}
                            </button>
                            <a href="#festivaluri-lista" className="btn btn-outline">VEZI FESTIVALURI</a>
                        </div>
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-festival">
                        <h2>ADAUGĂ FESTIVAL</h2>
                        <form className="event-form" onSubmit={adaugaFestival}>
                            <div className="form-group">
                                <label>Numele festivalului *</label>
                                <input type="text" name="titlu" placeholder="Ex: Brașov Open Air Festival" value={formular.titlu} onChange={schimbaCamp} />
                                {erori.titlu && <p className="eroare">{erori.titlu}</p>}
                            </div>
                            <div className="form-group">
                                <label>Gen muzical *</label>
                                <select name="gen" value={formular.gen} onChange={schimbaCamp}>
                                    {genuri.map((gen) => (<option key={gen} value={gen}>{gen}</option>))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Data *</label>
                                    <input type="text" name="data" placeholder="Ex: 15.07.2026" value={formular.data} onChange={schimbaCamp} />
                                    {erori.data && <p className="eroare">{erori.data}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Ora *</label>
                                    <input type="text" name="ora" placeholder="Ex: 16:00" value={formular.ora} onChange={schimbaCamp} />
                                    {erori.ora && <p className="eroare">{erori.ora}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Locația *</label>
                                <input type="text" name="locatie" placeholder="Ex: Poiana Brașov" value={formular.locatie} onChange={schimbaCamp} />
                                {erori.locatie && <p className="eroare">{erori.locatie}</p>}
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input type="text" name="cost" placeholder="Ex: 150 lei / abonament" value={formular.cost} onChange={schimbaCamp} />
                                {erori.cost && <p className="eroare">{erori.cost}</p>}
                            </div>
                            <div className="form-group">
                                <label>Descriere</label>
                                <textarea name="descriere" placeholder="Scrie câteva detalii despre festival..." value={formular.descriere} onChange={schimbaCamp} />
                            </div>
                            <button type="submit" className="btn btn-primary">Salvează festival</button>
                        </form>
                    </section>
                )}

                {festivaluri.length > 0 && (
                    <section className="categories" id="festivaluri-lista">
                        <h2>FESTIVALURI ADĂUGATE</h2>
                        <div className="filter-menu">
                            <button type="button" className={genActiv === "Toate" ? "filter-btn active-filter" : "filter-btn"} onClick={() => setGenActiv("Toate")}>Toate</button>
                            {genuri.map((gen) => (
                                <button type="button" key={gen} className={genActiv === gen ? "filter-btn active-filter" : "filter-btn"} onClick={() => setGenActiv(gen)}>{gen}</button>
                            ))}
                        </div>
                        {festivaluriFiltrate.length > 0 && (
                            <div className="grid">
                                {festivaluriFiltrate.map((festival) => (
                                    <div className="card event-card" key={festival.id}>
                                        <div className="card-img-container">
                                            <img src={festival.imagine} alt={festival.titlu} className="card-img-real" />
                                        </div>
                                        <div className="card-body event-card-body">
                                            <h3>{festival.titlu}</h3>
                                            <p className="event-category">{festival.gen}</p>
                                            <div className="event-details">
                                                <p><strong>Data:</strong> {festival.data}</p>
                                                <p><strong>Ora:</strong> {festival.ora}</p>
                                                <p><strong>Locație:</strong> {festival.locatie}</p>
                                                {festival.cost && <p><strong>Cost:</strong> {festival.cost}</p>}
                                            </div>
                                            {festival.descriere && <p className="event-description">{festival.descriere}</p>}
                                            <div className="event-actions">
                                                <button className="btn-card">Vezi detalii</button>
                                                <button type="button" className="delete-btn" onClick={() => stergeFestival(festival.id)}>Șterge</button>
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
            <ChatWidget currentUser="Anonim" currentEventId="festivaluri" />
        </div>
    );
}

export default Festivaluri;