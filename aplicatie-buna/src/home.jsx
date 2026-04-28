import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  // Hook-ul care ne permite să navigăm din cod
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bun venit pe pagina principală!</h1>
      <p>Apasă butonul de mai jos pentru a te autentifica.</p>
      
      {/* Butonul care te duce la Login */}
      <button 
        onClick={() => navigate('/login')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Mergi la Login
      </button>
    </div>
  );
}