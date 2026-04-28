import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

/* ─── Culori din tema principală ─────────────────────────────────────────── */
const PRIMARY   = '#990f4b';
const PRIMARY_D = '#7a0c3c';
const CARD_BG   = 'rgba(12, 5, 10, 0.75)';
const BORDER    = `1px solid rgba(153, 15, 75, 0.35)`;

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage]               = useState('');
  const [loading, setLoading]                         = useState(false);
  const [focusField, setFocusField]                   = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) { setErrorMessage('Parolele nu se potrivesc!'); return; }
    if (formData.password.length < 6) { setErrorMessage('Parola trebuie să aibă cel puțin 6 caractere!'); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(cred.user, { displayName: formData.name });
      navigate('/');
    } catch (err) {
      const map = {
        'auth/email-already-in-use': 'Acest email este deja utilizat de un alt cont.',
        'auth/invalid-email':        'Adresa de email nu este validă.',
        'auth/weak-password':        'Parola este prea slabă.',
      };
      setErrorMessage(map[err.code] || 'A apărut o eroare la crearea contului.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Helpers style ──────────────────────────────────────────────────────── */
  const getInputStyle = (field) => ({
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255,255,255,0.04)',
    border: focusField === field ? `1px solid ${PRIMARY}` : '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusField === field ? `0 0 14px rgba(153,15,75,0.35)` : 'none',
    boxSizing: 'border-box',
  });

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', position: 'relative' }}>

      {/* ── BACK ── */}
      <Link to="/" style={{ position: 'fixed', top: '20px', left: '20px', color: '#ccc', fontFamily: 'Oswald, sans-serif', fontSize: '0.85rem', letterSpacing: '1px', textDecoration: 'none', transition: '0.3s', zIndex: 100, textTransform: 'uppercase' }}
        onMouseEnter={(e) => { e.target.style.color = PRIMARY; }}
        onMouseLeave={(e) => { e.target.style.color = '#ccc'; }}>
        ← Back to Home
      </Link>

      {/* ── CARD ── */}
      <div style={{ background: CARD_BG, backdropFilter: 'blur(22px)', border: BORDER, borderRadius: '20px', padding: '50px 40px', maxWidth: '450px', width: '100%', boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(153,15,75,0.1)`, animation: 'fadeEntry 1s ease-out forwards' }}>

        {/* TITLU */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '6px', color: 'white' }}>
            Join Us
          </h1>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#aaa', fontSize: '0.88rem' }}>
            Creează-ți contul gratuit
          </p>

          {/* EROARE */}
          {errorMessage && (
            <div style={{ color: '#ffb3cc', background: 'rgba(153,15,75,0.12)', border: `1px solid ${PRIMARY}`, padding: '10px', borderRadius: '8px', marginTop: '15px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.84rem' }}>
              {errorMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          {/* NUME */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Nume complet</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ion Popescu"
              style={getInputStyle('name')} onFocus={() => setFocusField('name')} onBlur={() => setFocusField(null)} />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com"
              style={getInputStyle('email')} onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)} />
          </div>

          {/* PAROLĂ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Parolă</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
                style={{ ...getInputStyle('password'), paddingRight: '45px' }} onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem' }}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* CONFIRMARE PAROLĂ */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Confirmă parola</label>
            <div style={{ position: 'relative' }}>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••"
                style={{ ...getInputStyle('confirmPassword'), paddingRight: '45px' }} onFocus={() => setFocusField('confirmPassword')} onBlur={() => setFocusField(null)} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem' }}>
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#555' : PRIMARY, color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) { e.target.style.background = PRIMARY_D; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 10px 28px rgba(153,15,75,0.45)`; } }}
            onMouseLeave={(e) => { if (!loading) { e.target.style.background = PRIMARY; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; } }}>
            {loading ? 'Se creează contul...' : 'Creează cont'}
          </button>

          {/* SIGN IN LINK */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', color: '#888' }}>
              Ai deja cont?{' '}
              <Link to="/login" style={{ color: PRIMARY, textDecoration: 'none', fontWeight: 700, transition: '0.3s' }}
                onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = PRIMARY}>
                Autentifică-te
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;