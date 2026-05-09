import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const PRIMARY = '#990f4b';
const CARD_BG = 'rgba(12, 5, 10, 0.75)';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) { setUser(currentUser); } 
      else { navigate('/login'); } // Dacă nu e logat, îl trimite la Login
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundImage:'URL("/cont2.jpeg")'}}>
      <Link to="/" style={{ position: 'fixed', top: '20px', left: '20px', color: '#ccc', textDecoration: 'none' }}>← Back</Link>
      
      <div style={{ background: CARD_BG, backdropFilter: 'blur(22px)', border: `1px solid rgba(153, 15, 75, 0.35)`, borderRadius: '20px', padding: '50px 40px', maxWidth: '450px', width: '100%', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2rem', letterSpacing: '3px', marginBottom: '20px' }}>Contul Meu</h1>
        <div style={{ marginBottom: '30px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID Utilizator:</strong> {user.uid.substring(0, 8)}...</p>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', background: PRIMARY, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
          Deconectare
        </button>
      </div>
    </div>
  );
};

export default Account;