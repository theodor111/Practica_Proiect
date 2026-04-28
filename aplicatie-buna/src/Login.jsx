import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

/* ─── Culori din tema principală ─────────────────────────────────────────── */
const PRIMARY   = '#990f4b';
const PRIMARY_D = '#7a0c3c';   // hover mai întunecat
const CARD_BG   = 'rgba(12, 5, 10, 0.75)';
const BORDER    = `1px solid rgba(153, 15, 75, 0.35)`;

const Login = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  /* ─── Handlers ──────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      const map = {
        'auth/invalid-email':      'Adresa de email este invalidă.',
        'auth/user-disabled':      'Acest cont a fost dezactivat.',
        'auth/user-not-found':     'Nu există niciun cont cu această adresă de email.',
        'auth/wrong-password':     'Parola este incorectă.',
        'auth/invalid-credential': 'Email sau parolă incorectă.',
      };
      setError(map[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/');
    } catch (err) {
      setError(err.code === 'auth/popup-closed-by-user'
        ? 'Autentificarea a fost anulată.'
        : 'Autentificarea cu Google a eșuat.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Helpers style ──────────────────────────────────────────────────────── */
  const inputStyle = (disabled) => ({
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    boxSizing: 'border-box',
  });

  const focusIn  = (e) => { e.target.style.borderColor = PRIMARY; e.target.style.boxShadow = `0 0 14px rgba(153,15,75,0.35)`; };
  const focusOut = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; };

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', position: 'relative' }}>

      {/* BACK */}
      <Link to="/" style={{ position: 'fixed', top: '20px', left: '20px', color: '#ccc', fontFamily: 'Oswald, sans-serif', fontSize: '0.85rem', letterSpacing: '1px', textDecoration: 'none', transition: '0.3s', zIndex: 100, textTransform: 'uppercase' }}
        onMouseEnter={(e) => { e.target.style.color = PRIMARY; }}
        onMouseLeave={(e) => { e.target.style.color = '#ccc'; }}>
        ← Back to Home
      </Link>

      {/* ── CARD ── */}
      <div style={{ background: CARD_BG, backdropFilter: 'blur(22px)', border: BORDER, borderRadius: '20px', padding: '50px 40px', maxWidth: '450px', width: '100%', boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(153,15,75,0.1)`, animation: 'fadeEntry 1s ease-out forwards' }}>

        {/* LOGO + TITLU */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '6px', color: 'white' }}>
            Welcome Back
          </h1>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#aaa', fontSize: '0.88rem' }}>
            Conectează-te pentru a continua
          </p>
        </div>

        {/* EROARE */}
        {error && (
          <div style={{ background: 'rgba(153,15,75,0.12)', border: `1px solid ${PRIMARY}`, borderRadius: '8px', padding: '12px', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#ffb3cc', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="your@email.com"
              style={inputStyle(loading)} onFocus={focusIn} onBlur={focusOut} />
          </div>

          {/* PAROLĂ */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '8px' }}>Parolă</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} placeholder="••••••••"
                style={{ ...inputStyle(loading), paddingRight: '45px' }} onFocus={focusIn} onBlur={focusOut} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem', padding: '5px', opacity: loading ? 0.6 : 1 }}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <div style={{ textAlign: 'right', marginBottom: '25px' }}>
            <Link to="/forgot-password" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.82rem', color: PRIMARY, textDecoration: 'none', transition: '0.3s', pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
              onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = PRIMARY}>
              Ai uitat parola?
            </Link>
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#555' : PRIMARY, color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', marginBottom: '20px', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) { e.target.style.background = PRIMARY_D; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 10px 28px rgba(153,15,75,0.45)`; } }}
            onMouseLeave={(e) => { if (!loading) { e.target.style.background = PRIMARY; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; } }}>
            {loading ? 'Se conectează...' : 'Sign In'}
          </button>

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#666', letterSpacing: '2px' }}>SAU</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* GOOGLE */}
          <button type="button" onClick={handleGoogleSignIn} disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.88rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '25px', opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; } }}
            onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; } }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuă cu Google
          </button>

          {/* SIGN UP */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', color: '#888' }}>
              Nu ai cont?{' '}
              <Link to="/register" style={{ color: PRIMARY, textDecoration: 'none', fontWeight: 700, transition: '0.3s', pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
                onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = PRIMARY}>
                Înregistrează-te
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
