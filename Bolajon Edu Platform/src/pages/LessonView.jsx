import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { ChevronLeft, X, Play, Music, Image as ImageIcon, FileText } from 'lucide-react';

export default function LessonView() {
  const { monthId, weekIndex } = useParams();
  const navigate = useNavigate();
  const { mockData, playClickSound, user, normalize, getGroupCategory } = useAppContext();
  const [resources, setResources] = useState([]);
  const [activeCenter, setActiveCenter] = useState(null);

  const month = mockData.months.find(m => m.id === monthId);
  const theme = month?.themes[weekIndex];
  const weekLabel = `${parseInt(weekIndex) + 1}-hafta`;

  useEffect(() => {
    fetchResources();
  }, [monthId, weekIndex, user?.groupCategory]);

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/resources?t=${Date.now()}`);
      const all = await res.json();
      
      const targetCategory = user?.groupCategory || getGroupCategory(user?.location?.group || '');

      const filtered = all.filter(r => 
        normalize(r.month) === normalize(monthId) && 
        normalize(r.group) === normalize(targetCategory) &&
        normalize(r.theme) === normalize(theme)
      );
      setResources(filtered);
    } catch (e) { console.error(e); }
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    if (url.startsWith('http')) return url;
    return url;
  };

  const renderVideo = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const embedUrl = url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
      return (
        <iframe width="100%" height="315" src={embedUrl} title="Video" frameBorder="0" allowFullScreen style={{ borderRadius: '15px' }}></iframe>
      );
    }
    return <video controls src={getMediaUrl(url)} style={{ width: '100%', borderRadius: '15px', background: '#000' }} />;
  };

  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type="nursery" />
      
      <header className="dashboard-header" style={{ position: 'relative', zIndex: 10 }}>
        <button className="btn-back" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} /> ORQAGA
        </button>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>{theme}</h2>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{weekLabel}</span>
        </div>
      </header>

      <main className="main-content" style={{ zIndex: 1, position: 'relative', marginTop: '20px' }}>
        <div className="sections-grid">
          {mockData.sections.map((section) => {
            const centerResource = resources.find(r => normalize(r.center) === normalize(section.name));
            return (
              <motion.div
                key={section.id}
                className="glass-card"
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => { playClickSound(); setActiveCenter(section); }}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '30px 20px' }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '15px', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }}>
                  {section.icon}
                </div>
                <h3 style={{ color: '#2d3436', fontSize: '1rem', fontWeight: 'bold' }}>{section.name}</h3>
                {centerResource && <div style={{ marginTop: '10px', color: '#2ecc71', fontSize: '0.8rem' }}>✅ Material bor</div>}
              </motion.div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {activeCenter && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              className="glass-card"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'white', borderRadius: '30px' }}
            >
              <div style={{ background: activeCenter.bgColor, padding: '25px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>{activeCenter.icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{activeCenter.name}</h2>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{theme}</p>
                  </div>
                </div>
                <button onClick={() => setActiveCenter(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: '30px' }}>
                {resources.filter(r => normalize(r.center) === normalize(activeCenter.name)).map((res, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {res.videoUrl && (
                      <div className="media-section">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Play size={18} /> Video Mashgʻulot</h4>
                        {renderVideo(res.videoUrl)}
                      </div>
                    )}
                    {res.audioUrl && (
                      <div className="media-section">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Music size={18} /> Audio Material</h4>
                        <audio controls src={getMediaUrl(res.audioUrl)} style={{ width: '100%' }} />
                      </div>
                    )}
                    {res.images?.length > 0 && (
                      <div className="media-section">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><ImageIcon size={18} /> Rasmlar</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                          {res.images.map((img, j) => (
                            <img key={j} src={getMediaUrl(img)} style={{ width: '100%', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} alt="Resource" />
                          ))}
                        </div>
                      </div>
                    )}
                    {res.slidesUrl && (
                      <div className="media-section">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><FileText size={18} /> PDF Qoʻllanma</h4>
                        <a href={getMediaUrl(res.slidesUrl)} target="_blank" rel="noreferrer" className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                          Faylni ochish <FileText size={18} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {resources.filter(r => normalize(r.center) === normalize(activeCenter.name)).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
                    <p>Hozircha ushbu markazda materiallar yoʻq</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
