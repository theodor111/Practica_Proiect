import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const categorii = ["Fotbal", "Baschet", "Handbal", "Fitness", "Tenis", "Alergare", "Altele"];

function Sport() {
    const [afiseazaFormular, setAfiseazaFormular] = useState(false);
    const [categorieActiva, setCategorieActiva] = useState("Toate");
    const [evenimente, setEvenimente] = useState([]);

    const [formular, setFormular] = useState({
        titlu: "",
        categorie: "Fotbal",
        data: "",
        ora: "",
        locatie: "",
        cost: "",
        descriere: ""
    });

    useEffect(() => {
        const evenimenteSalvate = localStorage.getItem("evenimenteSportive");

        if (evenimenteSalvate) {
            setEvenimente(JSON.parse(evenimenteSalvate));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("evenimenteSportive", JSON.stringify(evenimente));
    }, [evenimente]);

    const schimbaCamp = (e) => {
        const { name, value } = e.target;

        setFormular({
            ...formular,
            [name]: value
        });
    };

    const adaugaEveniment = (e) => {
        e.preventDefault();

        if (!formular.titlu || !formular.data || !formular.ora || !formular.locatie) {
            alert("Completează titlul, data, ora și locația.");
            return;
        }

        const evenimentNou = {
            id: Date.now(),
            ...formular,
            imagine: "EvSp.png"
        };

        setEvenimente([evenimentNou, ...evenimente]);

        setFormular({
            titlu: "",
            categorie: "Fotbal",
            data: "",
            ora: "",
            locatie: "",
            cost: "",
            descriere: ""
        });

        setAfiseazaFormular(false);
    };

    const stergeEveniment = (id) => {
        setEvenimente(evenimente.filter((eveniment) => eveniment.id !== id));
    };

    const evenimenteFiltrate =
        categorieActiva === "Toate"
            ? evenimente
            : evenimente.filter((eveniment) => eveniment.categorie === categorieActiva);

    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/">HOME</Link>
                    <a href="#">CONCERTS</a>
                    <a href="#">FESTIVALS</a>
                    <Link to="/sport" className="active">SPORTS</Link>
                    <a href="#">TECH</a>
                    <a href="#">WORKSHOPS</a>
                    <a href="#">THEATER</a>
                    <a href="#">NIGHTLIFE</a>
                    <a href="#">ART</a>
                    <a href="#" className="active">CONT</a>
                </nav>
            </header>

            <main>
                <section className="hero sport-hero">
                    <div className="hero-content">
                        <h1>EVENIMENTE SPORTIVE<br />ÎN BRAȘOV</h1>
                        <p>- Adaugă și descoperă evenimente sportive.</p>

                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setAfiseazaFormular(!afiseazaFormular)}
                            >
                                {afiseazaFormular ? "ÎNCHIDE FORMULARUL" : "ADAUGĂ EVENIMENT"}
                            </button>

                            <a href="#sport-evenimente" className="btn btn-outline">
                                VEZI EVENIMENTE
                            </a>
                        </div>
                    </div>
                </section>

                {afiseazaFormular && (
                    <section className="categories" id="adauga-eveniment">
                        <h2>ADAUGĂ EVENIMENT SPORTIV</h2>

                        <form className="event-form" onSubmit={adaugaEveniment}>
                            <div className="form-group">
                                <label>Titlul evenimentului *</label>
                                <input
                                    type="text"
                                    name="titlu"
                                    placeholder="Ex: Meci de fotbal FC Brașov"
                                    value={formular.titlu}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoria *</label>
                                <select
                                    name="categorie"
                                    value={formular.categorie}
                                    onChange={schimbaCamp}
                                >
                                    {categorii.map((categorie) => (
                                        <option key={categorie} value={categorie}>
                                            {categorie}
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
                                        placeholder="Ex: 15:46"
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
                                    placeholder="Ex: Stadionul Tineretului, Brașov"
                                    value={formular.locatie}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cost</label>
                                <input
                                    type="text"
                                    name="cost"
                                    placeholder="Ex: Gratuit / 50 lei"
                                    value={formular.cost}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descriere</label>
                                <textarea
                                    name="descriere"
                                    placeholder="Scrie câteva detalii despre eveniment..."
                                    value={formular.descriere}
                                    onChange={schimbaCamp}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Salvează eveniment
                            </button>
                        </form>
                    </section>
                )}

                {evenimente.length > 0 && (
                    <section className="categories" id="sport-evenimente">
                        <h2>EVENIMENTE SPORTIVE</h2>

                        <div className="filter-menu">
                            <button
                                type="button"
                                className={categorieActiva === "Toate" ? "filter-btn active-filter" : "filter-btn"}
                                onClick={() => setCategorieActiva("Toate")}
                            >
                                Toate
                            </button>

                            {categorii.map((categorie) => (
                                <button
                                    type="button"
                                    key={categorie}
                                    className={categorieActiva === categorie ? "filter-btn active-filter" : "filter-btn"}
                                    onClick={() => setCategorieActiva(categorie)}
                                >
                                    {categorie}
                                </button>
                            ))}
                        </div>

                        {evenimenteFiltrate.length > 0 && (
                            <div className="grid">
                                {evenimenteFiltrate.map((eveniment) => (
                                    <div className="card event-card" key={eveniment.id}>
                                        <div className="card-img-container">
                                            <img
                                                src={eveniment.imagine}
                                                alt={eveniment.titlu}
                                                className="card-img-real"
                                            />
                                        </div>

                                        <div className="card-body event-card-body">
                                            <h3>{eveniment.titlu}</h3>

                                            <p className="event-category">{eveniment.categorie}</p>

                                            <div className="event-details">
                                                <p><strong>Data:</strong> {eveniment.data}</p>
                                                <p><strong>Ora:</strong> {eveniment.ora}</p>
                                                <p><strong>Locație:</strong> {eveniment.locatie}</p>

                                                {eveniment.cost && (
                                                    <p><strong>Cost:</strong> {eveniment.cost}</p>
                                                )}
                                            </div>

                                            {eveniment.descriere && (
                                                <p className="event-description">{eveniment.descriere}</p>
                                            )}

                                            <div className="event-actions">
                                                <button className="btn-card">
                                                    Vezi detalii
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() => stergeEveniment(eveniment.id)}
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

export default Sport;