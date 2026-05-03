import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Sport from "./Sport";
import Concerte from "./Concerte";
const categoriiDate = [
    { id: 1, titlu: 'CONCERTS', sub: 'Live band', img: 'concerte.png', btn: 'Vezi Concerte', link: '/concerte' },
    { id: 2, titlu: 'FESTIVALS', sub: 'Outdoor stage', img: 'festivaluri.png', btn: 'Află Mai Multe' },
    { id: 3, titlu: 'SPORTS', sub: 'Bilete Meciuri', img: 'sport.png', btn: 'Bilete Meciuri', link: '/sport' },
    { id: 4, titlu: 'TECH', sub: 'Inovări & Expo', img: 'tech.png', btn: 'Webinars & Expo' },
    { id: 5, titlu: 'WORKSHOPS', sub: 'Webinars & Expo', img: 'work.png', btn: 'Află Mai Multe' },
    { id: 6, titlu: 'THEATER', sub: 'Lumea artei', img: 'teatru.png', btn: 'Webinar & Expo' },
    { id: 7, titlu: 'NIGHTLIFE', sub: 'Petreceri & Cluburi', img: 'nightlife.png', btn: 'Află Mai Multe' },
    { id: 8, titlu: 'ART', sub: 'Vezi lumea prin ochii altora', img: 'art.png', btn: 'Vezi Concerte' },
];

function Home() {
    return (
        <div className="app-root">
            <header>
                <nav>
                    <Link to="/" className="active">HOME</Link>
                    <Link to="/concerte">CONCERTS</Link>
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
                <section className="hero">
                    <div className="hero-content">
                        <h1>DESCOPERĂ EVENIMENTELE<br />DIN BRAȘOV!</h1>
                        <p>- Explorează mii de experiențe în apropierea ta.</p>
                        <div className="btn-group">
                            <a href="#evenimente" className="btn btn-primary">EXPLOREAZĂ</a>
                            <a href="#evenimente" className="btn btn-outline">Evenimentele de azi</a>
                        </div>
                    </div>
                </section>

                <section className="categories" id="evenimente">
                    <h2>TOATE CATEGORIILE DE EVENIMENTE</h2>
                    <div className="grid">
                        {categoriiDate.map((item) => {
                            const cardContent = (
                                <div className="card">
                                    <div className="card-img-container">
                                        <img src={item.img} alt={item.titlu} className="card-img-real" />
                                    </div>
                                    <div className="card-body">
                                        <h3>{item.titlu}</h3>
                                        <p>{item.sub}</p>
                                        <button className="btn-card">{item.btn}</button>
                                    </div>
                                </div>
                            );

                            if (item.link) {
                                return (
                                    <Link to={item.link} className="card-link" key={item.id}>
                                        {cardContent}
                                    </Link>
                                );
                            }

                            return (
                                <div key={item.id}>
                                    {cardContent}
                                </div>
                            );
                        })}
                    </div>
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
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sport" element={<Sport />} />
            <Route path="/concerte" element={<Concerte />} />
        </Routes>
    );
}

export default App;