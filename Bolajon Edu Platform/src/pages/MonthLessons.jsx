import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { ChevronLeft, BookOpen } from 'lucide-react';

export default function MonthLessons() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mockData, playClickSound, user, normalize, getGroupCategory } = useAppContext();
  const [adminResources, setAdminResources] = useState([]);

  const month = mockData.months.find(m => m.id === id);

  useEffect(() => {
    fetchResources();
  }, [id, user?.groupCategory]);

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/resources?t=${Date.now()}`);
      const all = await res.json();
      
      const targetCategory = user?.groupCategory || getGroupCategory(user?.location?.group || '');

      const filtered = all.filter(r => 
        normalize(r.month) === normalize(id) && 
        normalize(r.group) === normalize(targetCategory)
      );
      setAdminResources(filtered);
    } catch (e) { console.error(e); }
  };

  const handleLessonLink = (index) => {
    playClickSound();
    navigate(`/lesson/${id}/${index}`);
  };

  if (!month) return <div>Oy topilmadi</div>;

  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type={id === 'dekabr' || id === 'yanvar' || id === 'fevral' ? 'winter' : 'nursery'} />
      
      <header className="dashboard-header" style={{ position: 'relative', zIndex: 10 }}>
        <button className="btn-back" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} /> ORQAGA
        </button>
        <div className="month-title-badge" style={{ background: month.color, padding: '10px 25px', borderRadius: '25px', color: 'white', fontWeight: 'bold', fontSize: '1.4rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          {month.name} mashgʻulotlari
        </div>
      </header>

      <main className="main-content" style={{ zIndex: 1, position: 'relative', marginTop: '30px' }}>
        <div className="grid-cards">
          {month.themes.map((theme, index) => {
            const hasResource = adminResources.some(r => normalize(r.theme) === normalize(theme));
            
            return (
              <motion.div
                key={index}
                className="glass-card lesson-card"
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handleLessonLink(index)}
                style={{ cursor: 'pointer', borderLeft: `8px solid ${month.color}`, overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ background: `${month.color}22`, color: month.color, padding: '8px 15px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {index + 1}-hafta
                  </div>
                  {hasResource && <span style={{ fontSize: '1.2rem' }}>⭐</span>}
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#2d3436', marginBottom: '15px', lineHeight: '1.4' }}>{theme}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#636e72', fontSize: '0.9rem' }}>
                  <BookOpen size={16} /> <span>Mashgʻulotni koʻrish</span>
                </div>
              </motion.div>
             );
          })}
        </div>
      </main>
    </div>
  );
}
