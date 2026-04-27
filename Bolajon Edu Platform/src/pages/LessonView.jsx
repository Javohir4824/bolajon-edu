import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';
import { CheckCircle, Play, Pause, ChevronRight, X } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LessonView() {
  const { id, lessonId } = useParams();
  const { mockData, playClickSound, addPoints, user } = useAppContext();
  const [activeSection, setActiveSection] = useState(null);
  const [completed, setCompleted] = useState({});
  const [resources, setResources] = useState([]);
  const [uploadingHW, setUploadingHW] = useState(false);
  const [hwStatus, setHwStatus] = useState({});
  
  const navigate = useNavigate();

  const monthData = mockData?.months?.find(m => m.id === id);
  const theme = monthData?.themes ? monthData.themes[lessonId] : '';

  useEffect(() => {
    if (!monthData || !theme) return;

    const fetchResources = async () => {
      try {
        const res = await fetch(`/api/resources?t=${Date.now()}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();

        const studentGroup = String(user?.location?.group || '').toLowerCase();
        
        const getCategory = (g) => {
          if (g.includes('kichik')) return 'Kichik';
          if (g.includes('oʻrta') || g.includes('orta')) return 'Oʻrta';
          if (g.includes('katta') || g.includes('kotta')) return 'Katta';
          if (g.includes('tayyorlov')) return 'Tayyorlov';
          return '';
        };

        const targetCategory = getCategory(studentGroup);
        const fuzzy = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const filtered = data.filter(r => 
          fuzzy(r.month) === fuzzy(monthData.name) && 
          fuzzy(r.theme) === fuzzy(theme) &&
          fuzzy(r.group) === fuzzy(targetCategory)
        );
        
        setResources(filtered);
      } catch (e) { 
        console.error('Error fetching resources', e); 
      }
    };
    fetchResources();
  }, [id, lessonId, user?.location?.group]);

  const handleSectionClick = (section) => {
    playClickSound();
    setActiveSection(section);
  };

  const closeModal = () => {
    playClickSound();
    setActiveSection(null);
  };

  const markComplete = (sectionId) => {
    playClickSound();
    if (!completed[sectionId]) {
      setCompleted({ ...completed, [sectionId]: true });
    }
  };

  const nextCenter = () => {
    const currentIndex = mockData.sections.findIndex(s => s.id === activeSection.id);
    if (currentIndex < mockData.sections.length - 1) {
      markComplete(activeSection.id);
      setActiveSection(mockData.sections[currentIndex + 1]);
    } else {
      markComplete(activeSection.id);
      closeModal();
    }
  };

  const uploadHomework = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingHW(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload file
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      // 2. Submit homework data
      await fetch('/api/homeworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: user.name,
          viloyat: user.location.viloyat,
          tuman: user.location.tuman,
          dmtt: user.location.dmtt,
          group: user.location.group,
          month: monthData.name,
          theme: theme,
          center: activeSection.name,
          fileUrl: uploadData.url
        })
      });

      setHwStatus({ ...hwStatus, [activeSection.id]: true });
      alert("Vazifa ustozga yuborildi! Barakalla!");
    } catch(err) {
      alert("Xatolik yuz berdi :(");
    } finally {
      setUploadingHW(false);
    }
  };

  const getSeason = (monthId) => {
    if (['sentyabr', 'oktyabr', 'noyabr'].includes(monthId)) return 'autumn';
    if (['dekabr', 'yanvar', 'fevral'].includes(monthId)) return 'winter';
    if (['mart', 'aprel', 'may'].includes(monthId)) return 'spring';
    return 'dashboard';
  };

  // Helper to get correct media URL
  const getMediaUrl = (url) => {
    if (!url) return '';
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    if (url.startsWith('http')) return url;
    return url;
  };

  // Helper for fuzzy matching in JSX
  const fuzzy = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Find media if uploaded by Admin for this specific center
  const centerResource = activeSection ? resources.find(r => 
    fuzzy(r.center) === fuzzy(activeSection.name) || 
    fuzzy(r.center).includes(fuzzy(activeSection.name))
  ) : null;
  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type={getSeason(id)} />
      <TopBar title={theme || 'Faoliyat Markazlari'} />
      
      <main className="main-content" style={{ zIndex: 1, position: 'relative' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#555', fontSize: '2rem' }}>
          Markazlarni tanlang va oʻrganing! 🪄
        </h2>
        
        <div className="sections-grid">
          {mockData.sections.map((section, idx) => {
            const isDone = completed[section.id];
            
            return (
              <motion.div 
                key={section.id}
                className="section-item"
                onClick={() => handleSectionClick(section)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                style={{ 
                  border: isDone ? `4px solid var(--success)` : `2px solid #e0f2fe`,
                  background: isDone ? '#e8f5e9' : '' 
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
                          </div>
                        </object>
                      </div>
                    )}

                    {/* VAZIFA YUKLASH QISMI */}
                    <div className="glass-card" style={{ padding: '20px', background: '#e0f2fe', border: '2px dashed #38bdf8' }}>
                       <h3 style={{ color: '#0284c7', marginBottom: '10px' }}>📤 Vazifani topshirish</h3>
                       <p style={{ marginBottom: '16px', color: '#0369a1' }}>Bajargan ishingizni rasm yoki video koʻrinishida yuboring!</p>
                       
                       {hwStatus[activeSection.id] ? (
                          <div style={{ color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={24} /> Vazifa ustozga yetkazildi!
                          </div>
                       ) : (
                          <label style={{ display: 'inline-block', background: '#0ea5e9', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {uploadingHW ? "Yuklanmoqda..." : "Fayl tanlash va Yuborish 📥"}
                            <input type="file" onChange={uploadHomework} accept="image/*,video/*,audio/*" style={{ display: 'none' }} disabled={uploadingHW} />
                          </label>
                       )}
                    </div>

                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#777' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>🚧</div>
                    <h3>Oʻqituvchi hali bu markazga material yuklamagan</h3>
                    <p>Lekin siz shu markazda xayoliy oʻyinlar oʻynashingiz mumkin!</p>
                  </div>
                )}
                
              </div>

              {/* Footer */}
              <div style={{ padding: '24px', background: 'white', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={nextCenter}
                  style={{ padding: '16px 32px', background: activeSection.bgColor, color: 'white', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 15px ${activeSection.bgColor}80` }}
                >
                  Keyingi markazga oʻtish <ChevronRight size={24} />
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
