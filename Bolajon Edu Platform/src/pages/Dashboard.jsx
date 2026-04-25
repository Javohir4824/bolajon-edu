import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Dashboard() {
  const { mockData, user, playClickSound, points } = useAppContext();
  const navigate = useNavigate();
  const [latestResources, setLatestResources] = useState([]);

  useEffect(() => {
    // Auth Check: If Director is accidentally here, redirect back to Director Panel
    const isDirector = localStorage.getItem('directorAuth');
    if (isDirector) {
      navigate('/director');
      return;
    }

    // Role check: If no student user, go to login
    if (!user) {
      navigate('/');
      return;
    }

    fetchLatestResources();
  }, [user, navigate]);

  const fetchLatestResources = async () => {
    try {
      const res = await fetch('/api/resources');
      const allRes = await res.json();
      
      const studentGroupRaw = user?.location?.group || '';
      const low = studentGroupRaw.toLowerCase();
      let simplifiedGroupName = '';
      if (low.includes('kichik')) simplifiedGroupName = 'Kichik';
      else if (low.includes('oʻrta') || low.includes('oвЂrta') || low.includes('oʻrta')) simplifiedGroupName = 'Oʻrta';
      else if (low.includes('katta') || low.includes('kotta')) simplifiedGroupName = 'Katta';
      else if (low.includes('tayyorlov')) simplifiedGroupName = 'Tayyorlov';

      const filtered = allRes.filter(r => r.group === simplifiedGroupName);
      setLatestResources(filtered.reverse().slice(0, 3)); 
    } catch (e) { console.error(e); }
  };

  const handleMonthClick = (monthId) => {
    playClickSound();
    navigate(`/month/${monthId}`);
  };

  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type="dashboard" />
      <TopBar title="Oylar roʻyxati" hideBack={true} />
      
      <main className="main-content" style={{ zIndex: 1, position: 'relative' }}>
        
        {/* User Stats Summary */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card" 
            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 25px', borderRadius: '50px', border: '3px solid #fbbf24', background: 'rgba(255,255,255,0.9)' }}
          >
            <div style={{ fontSize: '1.8rem' }}>🌟</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 'bold', textTransform: 'uppercase' }}>Toʻplagan yulduzcha:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#b45309' }}>{points} ball</div>
            </div>
          </motion.div>
        </div>

        <h1 style={{ textAlign: 'center', margin: '10px 0 20px', fontSize: '2.5rem', color: 'var(--primary)' }}>
          Qaysi oyni oʻrganamiz? 🗓️
        </h1>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button 
             onClick={() => { playClickSound(); navigate('/events'); }} 
             style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #f472b6, #db2777)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(219,39,119,0.3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
             🎉 Bogʻchamiz Bayramlari va Tadbirlari
          </button>
        </div>
        
        <motion.div 
          className="grid-cards"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {mockData.months.map(month => (
            <motion.div 
              key={month.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="month-card"
              style={{ borderTop: `8px solid ${month.color}` }}
              onClick={() => handleMonthClick(month.id)}
            >
              <h2 style={{ color: month.color }}>{month.name}</h2>
              <p style={{ color: '#777', fontWeight: 600 }}>{month.themes.length} ta mavzu</p>
              <div style={{ marginTop: 16, fontSize: '3rem' }}>
                {month.id === 'sentyabr' ? '🎒' : 
                 month.id === 'oktyabr' ? '🍂' :
                 month.id === 'dekabr' ? '❄️' :
                 month.id === 'mart' ? '🌸' :
                 month.id === 'may' ? '☀️' : '📚'}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
