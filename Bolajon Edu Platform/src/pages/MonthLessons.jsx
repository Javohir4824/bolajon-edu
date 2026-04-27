import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function MonthLessons() {
  const { id } = useParams();
  const { mockData, user, playClickSound } = useAppContext();
  const navigate = useNavigate();
  const [adminResources, setAdminResources] = useState([]);

  const monthData = mockData.months.find(m => m.id === id);

  useEffect(() => {
    fetchResources();
  }, [id, user]);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      const all = await res.json();
      
      const studentGroup = String(user?.location?.group || '').toLowerCase();
      
      // Helper to map specific student group to general admin category
      const getCategory = (g) => {
        if (g.includes('kichik')) return 'Kichik guruh';
        if (g.includes('oʻrta') || g.includes('orta')) return 'Oʻrta guruh';
        if (g.includes('katta') || g.includes('kotta')) return 'Katta guruh';
        if (g.includes('tayyorlov')) return 'Tayyorlov guruh';
        return '';
      };

      const targetCategory = getCategory(studentGroup);

      // Filter for this month and student's group category
      const filtered = all.filter(r => 
        r.month.toLowerCase() === id.toLowerCase() && 
        r.group === targetCategory
      );
      setAdminResources(filtered);
    } catch (e) { console.error(e); }
  };

  if (!monthData) return <div style={{ padding: '50px', textAlign: 'center' }}>Hech narsa topilmadi</div>;

  const getSeason = (monthId) => {
    if (['sentyabr', 'oktyabr', 'noyabr'].includes(monthId)) return 'autumn';
    if (['dekabr', 'yanvar', 'fevral'].includes(monthId)) return 'winter';
    if (['mart', 'aprel', 'may'].includes(monthId)) return 'spring';
    return 'dashboard';
  };

  const handleThemeClick = (index) => {
    playClickSound();
    navigate(`/month/${id}/lesson/${index}`);
  };

  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type={getSeason(id)} />
      <TopBar title={`${monthData.name} oyi mavzulari`} />
      
      <main className="main-content" style={{ zIndex: 1, position: 'relative' }}>
        <h1 style={{ textAlign: 'center', margin: '20px 0', fontSize: '2.5rem', color: monthData.color }}>
          {monthData.name} Oyi 🚀
        </h1>
        
        <div className="grid-cards" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {[1, 2, 3, 4].map((weekNum, idx) => {
             const weekKey = `${weekNum}-hafta`;
             const adminRes = adminResources.find(r => r.week === weekKey);
             const displayTheme = adminRes ? adminRes.theme : (monthData.themes[idx] || 'Mavzu belgilanmagan');

             return (
              <motion.div 
                key={idx}
                className="lesson-card"
                style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  textAlign: 'left',
                  borderLeft: adminRes ? `10px solid var(--secondary)` : 'none',
                  background: adminRes ? 'linear-gradient(90deg, #f0f9ff, #ffffff)' : '#ffffff'
                }}
                onClick={() => handleThemeClick(idx)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ color: 'var(--text-dark)', margin: 0 }}>{weekNum}-Hafta: {displayTheme}</h2>
                    {adminRes && <span style={{ fontSize: '0.7rem', background: 'var(--secondary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>YANGI</span>}
                  </div>
                  <p style={{ color: '#888', fontWeight: 'bold', marginTop: '5px' }}>Kirish qismi va 5 ta markaz</p>
                </div>
                <div style={{ fontSize: '2rem' }}>{adminRes ? '✨' : '👉'}</div>
              </motion.div>
             );
          })}
        </div>
      </main>
    </div>
  );
}
