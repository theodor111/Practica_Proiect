import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const genuri = ["Pop", "Rock", "Jazz", "Clasic", "Hip-Hop", "Electronic", "Folk", "Altele"];

function Concerte() {
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [genActiv, setGenActiv] = useState("Toate");
    const [concerte, setConcerte] = useState([]);

    const [formular, setFormular] = useState({
        titlu: "",
        gen: "Pop",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    useEffect(() => {
        const concerteSalvate = localStorage.getItem("concerteAdaugate");

        if (concerteSalvate) {
            setConcerte(JSON.parse(concerteSalvate));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("concerteAdaugate", JSON.stringify(concerte));
    }, [concerte]);

    const schimbaCamp = (e) => {
        const { name, value } = e.target;

        setFormular({
            ...formular,
            [name]: value
        });
    };

    const adaugaConcert = (e) => {
        e.preventDefault();

        if (!formular.titlu || !formular.data || !formular.ora || !formular.locatie) {
            alert("Completează titlul, data, ora și locația.");
            return;
        }

        const concertNou = {
            id: Date.now(),
            ...formular,
            imagine: "ConEv.png"
        };

        setConcerte([concertNou, ...concerte]);

        setFormular({
            titlu: "",
            gen: "Pop",
            data: "",
            ora: "",
            locatie: "",
            cost: "",
            descriere: ""
        });

        setAfiseazaFormular(false);
    };

    const stergeConcert = (id) => {
        setConcerte(concerte.filter((concert) => concert.id !== id));
    };

    const concerteFiltrate =
        genActiv === "Toate"
            ? concerte
            : concerte.filter((concert) => concert.gen === genActiv);

    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/">HOME</Link>
                    <Link to="/concerte" className="active">CONCERTS</Link>
                    <a href="#">FESTIVALS</a>
                    <Link to="/sport">SPORTS</Link>
                    <a href="#">TECH</a>
                    <a href="#">WORKSHOPS</a>
                    <a href="#">THEATER</a>
                    <a href="#">NIGHTLIFE</a>
                    <a href="#">ART</a>
                    <a href="#" className="active">CONT</a>
                </nav>
            </header>

            <main>
                <section className="hero concerts-hero">
                    <div className="hero-content">
                        <h1>CONCERTE LIVE<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă concerte, artiști și seri live.</p>

                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setAfiseazaFormular(!afiseazaFormular)}
                            >
                                {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ CONCERT"}
                            </button>

                            <a href="#concerte-lista" className="btn btn-outline">
                                VEZI CONCERTE
                            </a>
                        </div>
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-concert">
                        <h2>ADAUGĂ CONCERT</h2>

                        <form className="event-form" onSubmit={adaugaConcert}>
                            <div className="form-group">
                                <label>Titlul concertului *</label>
                                <input
                                    type="text"
                                    name="titlu"
                                    placeholder="Ex: Concert live în Piața Sfatului"
                                    value={formular.titlu}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Gen muzical *</label>
                                <select
                                    name="gen"
                                    value={formular.gen}
                                    onChange={schimbaCamp}
                                >
                                    {genuri.map((gen) => (
                                        <option key={gen} value={gen}>
                                            {gen}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Data *</label>
                                    <input
                                        type="text"
                                        name="data"
                                        placeholder="Ex: 27.05.2026"
                                        value={formular.data}
                                        onChange={schimbaCamp}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ora *</label>
                                    <input
                                        type="text"
                                        name="ora"
                                        placeholder="Ex: 20:30"
                                        value={formular.ora}
                                        onChange={schimbaCamp}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Locația *</label>
                                <input
                                    type="text"
                                    name="locatie"
                                    placeholder="Ex: Piața Sfatului, Brașov"
                                    value={formular.locatie}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cost</label>
                                <input
                                    type="text"
                                    name="cost"
                                    placeholder="Ex: Gratuit / 80 lei"
                                    value={formular.cost}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descriere</label>
                                <textarea
                                    name="descriere"
                                    placeholder="Scrie câteva detalii despre concert..."
                                    value={formular.descriere}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Salvează concert
                            </button>
                        </form>
                    </section>
                )}

                {concerte.length > 0 && (
                    <section className="categories" id="concerte-lista">
                        <h2>CONCERTE ADĂUGATE</h2>

                        <div className="filter-menu">
                            <button
                                type="button"
                                className={genActiv === "Toate" ? "filter-btn active-filter" : "filter-btn"}
                                onClick={() => setGenActiv("Toate")}
                            >
                                Toate
                            </button>

                            {genuri.map((gen) => (
                                <button
                                    type="button"
                                    key={gen}
                                    className={genActiv === gen ? "filter-btn active-filter" : "filter-btn"}
                                    onClick={() => setGenActiv(gen)}
                                >
                                    {gen}
                                </button>
                            ))}
                        </div>

                        {concerteFiltrate.length > 0 && (
                            <div className="grid">
                                {concerteFiltrate.map((concert) => (
                                    <div className="card event-card" key={concert.id}>
                                        <div className="card-img-container">
                                            <img
                                                src={concert.imagine}
                                                alt={concert.titlu}
                                                className="card-img-real"
                                            />
                                        </div>

                                        <div className="card-body event-card-body">
                                            <h3>{concert.titlu}</h3>

                                            <p className="event-category">{concert.gen}</p>

                                            <div className="event-details">
                                                <p><strong>Data:</strong> {concert.data}</p>
                                                <p><strong>Ora:</strong> {concert.ora}</p>
                                                <p><strong>Locație:</strong> {concert.locatie}</p>

                                                {concert.cost && (
                                                    <p><strong>Cost:</strong> {concert.cost}</p>
                                                )}
                                            </div>

                                            {concert.descriere && (
                                                <p className="event-description">{concert.descriere}</p>
                                            )}

                                            <div className="event-actions">
                                                <button className="btn-card">
                                                    Vezi detalii
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() => stergeConcert(concert.id)}
                                                >
                                                    Șterge
                                                </button>
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
                        <a href="#" className="icon-circle">f</a>
                        <a href="#" className="icon-circle">ig</a>
                        <a href="#" className="icon-circle">t</a>
                    </div>
                </div>

                <div className="footer-section">
                    <p className="footer-title">CONTACT</p>
                    <a href="/Termeni si conditii.pdf" className="terms-link">TERMENI ȘI CONDIȚII</a>
                </div>
            </footer>
        </div>
    );
}

export default Concerte;