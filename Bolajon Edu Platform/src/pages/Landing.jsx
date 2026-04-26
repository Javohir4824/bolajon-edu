import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';

export default function Landing() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [regStep, setRegStep] = useState(1); // 1: Personal Info, 2: Account Info
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Name fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, saveUser, playClickSound } = useAppContext();

  useEffect(() => {
    if (user?.backendId) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError('Login va parolni kiriting!');

    setLoading(true);
    setError('');
    playClickSound();

    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        // Clear director session if exists
        localStorage.removeItem('directorAuth');
        saveUser({
          ...data,
          backendId: data.id,
          location: {
            viloyat: data.viloyat,
            tuman: data.tuman,
            dmtt: data.dmtt,
            group: data.group
          }
        });
        localStorage.setItem('bolajon_points', data.points.toString());
        navigate('/dashboard');
      } else {
        setError(data.error || 'Xatolik!');
      }
    } catch (e) {
      setError('Serverga ulanib bo\'lmadi!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegNextStep = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !patronymic) return setError('Iltimos, ism, familiya va otangiz ismini kiriting!');
    setError('');
    playClickSound();
    setRegStep(2);
  };

  const handleRegisterFinal = (e) => {
    e.preventDefault();
    if (!username || !password) return setError('Login va parolni kiriting!');
    if (password !== confirmPassword) return setError('Parollar mos kelmadi!');
    if (password.length < 4) return setError('Parol kamida 4 ta belgidan iborat bo\'lsin!');

    playClickSound();
    const fullName = `${lastName} ${firstName} ${patronymic}`;
    // Save partial data and move to location selection
    saveUser({ username, password, name: fullName, isRegistering: true });
    navigate('/location');
  };

  return (
    <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <AnimatedBackground type="nursery" />

      <motion.div
        className="glass-card"
        style={{ width: '100%', maxWidth: '450px', textAlign: 'center', zIndex: 1, position: 'relative', padding: '40px' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: 360 }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 10, ease: "linear" }
          }}
          className="landing-icon"
          style={{ fontSize: '4rem', marginBottom: '20px', display: 'inline-block' }}
        >
          {mode === 'login' ? '🔑' : (regStep === 1 ? '☀️' : '🚀')}
        </motion.div>

        <h1 className="landing-title" style={{ color: 'var(--primary)', fontSize: '2.2rem', marginBottom: '8px' }}>
          {mode === 'login' ? 'Salom bolajon!' : (regStep === 1 ? 'Salom bolajon!' : 'Roʻyxatdan oʻtish')}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {mode === 'login' ? 'Oʻz hisobingga kir' : (regStep === 1 ? 'Isming nima?' : 'Login va parol tanla')}
        </p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.9rem', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : (regStep === 1 ? handleRegNextStep : handleRegisterFinal)}>
          {mode === 'register' && regStep === 1 && (
            <AnimatePresence mode="wait">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <input type="text" placeholder="Familiyangiz..." value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <input type="text" placeholder="Ismingiz..." value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <input type="text" placeholder="Otangizning ismi..." value={patronymic} onChange={(e) => setPatronymic(e.target.value)} />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {mode === 'register' && regStep === 2 && (
            <AnimatePresence mode="wait">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <UserPlus size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Login yaratish..." value={username} onChange={(e) => setUsername(e.target.value)} style={{ paddingLeft: '45px' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" placeholder="Parol tanlang..." value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '45px' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" placeholder="Parolni tasdiqlang..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ paddingLeft: '45px' }} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {mode === 'login' && (
            <>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <UserPlus size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" placeholder="Login..." value={username} onChange={(e) => setUsername(e.target.value)} style={{ paddingLeft: '45px' }} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="password" placeholder="Parol..." value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '45px' }} />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn primary" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : (
              mode === 'login' ? <>Kirish <ArrowRight size={20} /></> : (regStep === 1 ? <>Keyingisi <ArrowRight size={20} /></> : <>Roʻyxatdan oʻtish <ArrowRight size={20} /></>)
            )}
          </button>

          {mode === 'register' && regStep === 2 && (
            <button type="button" onClick={() => setRegStep(1)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>
              ⬅️ Ortga qaytish
            </button>
          )}
        </form>

        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <button
            onClick={() => { playClickSound(); setMode(mode === 'login' ? 'register' : 'login'); setRegStep(1); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {mode === 'login' ? "Akkaunting yoʻqmi? Roʻyxatdan oʻt 🌟" : "Akkaunting bormi? Kirish 🔑"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
