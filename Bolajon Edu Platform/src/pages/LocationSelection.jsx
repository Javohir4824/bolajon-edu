import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';

export default function LocationSelection() {
  const { mockData, user, saveUser, playClickSound } = useAppContext();
  const [viloyat, setViloyat] = useState('');
  const [tuman, setTuman] = useState('');
  const [dmtt, setDmtt] = useState('');
  const [group, setGroup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.location) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleNext = async () => {
    playClickSound();
    if (viloyat && tuman && dmtt && group) {
      try {
        if (user.isRegistering) {
          // Finalize registration
          const res = await fetch('/api/students/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              username: user.username, 
              password: user.password, 
              name: user.name, 
              viloyat, tuman, dmtt, group 
            })
          });
          const data = await res.json();
          if (res.ok) {
            saveUser({ ...data, backendId: data.id, location: { viloyat, tuman, dmtt, group } });
            navigate('/dashboard');
          } else {
            alert(data.error || "Xatolik yuz berdi!");
          }
        } else {
          // Fallback or guest mode
          saveUser({ ...user, location: { viloyat, tuman, dmtt, group } });
          navigate('/dashboard');
        }
      } catch (e) {
        console.error('Server is not running', e);
        alert("Server bilan aloqa yoʻq!");
      }
    } else {
      alert("Iltimos, barcha qatorlarni toʻldiring!");
    }
  };

  const tumansList = viloyat ? (mockData.tumans[viloyat] || ['Tuman 1', 'Tuman 2', 'Tuman 3']) : [];

  return (
    <div className="app-layout">
      <TopBar title="Manzilni tanlang" hideBack={true} />
      
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          className="glass-card"
          style={{ width: '100%', maxWidth: '600px' }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="form-group">
            <label>Viloyatingizni tanlang</label>
            <select value={viloyat} onChange={(e) => { setViloyat(e.target.value); setTuman(''); }}>
              <option value="">-- Viloyat --</option>
              {mockData.viloyats.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tuman yoki Shaharingiz</label>
            <select value={tuman} onChange={(e) => setTuman(e.target.value)} disabled={!viloyat}>
              <option value="">-- Tuman --</option>
              {tumansList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>DMTT raqami</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                placeholder="Masalan: 3" 
                value={dmtt}
                onChange={(e) => setDmtt(e.target.value)}
                style={{ paddingRight: '70px', width: '100%' }}
              />
              <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: '900', pointerEvents: 'none' }}>DMTT</span>
            </div>
          </div>

          <div className="form-group">
            <label>Guruhingizni tanlang</label>
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">-- Guruhni tanlang --</option>
              {mockData.groups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <button onClick={handleNext} className="btn primary" style={{ width: '100%', marginTop: '16px' }}>
            Davom etish ✨
          </button>
        </motion.div>
      </main>
    </div>
  );
}
