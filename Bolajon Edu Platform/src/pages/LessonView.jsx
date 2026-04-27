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
    if (url.startsWith('http')) return url;
    // If it's a relative path like /uploads/..., it will work fine on the same domain
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
                }}
              >
                <div className="section-icon" style={{ background: section.bgColor }}>
                  {section.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{section.name}</h3>
                {isDone && <CheckCircle color="var(--success)" size={32} style={{ position: 'absolute', top: 16, right: 16 }} />}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* DETAILED CONTENT MODAL */}
      <AnimatePresence>
        {activeSection && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{ padding: '20px' }}
          >
            <motion.div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 100, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 100, scale: 0.9, opacity: 0 }}
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ background: activeSection.bgColor, padding: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '3rem' }}>{activeSection.icon}</span>
                  <div>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>{activeSection.name}</h2>
                    <p style={{ margin: 0, opacity: 0.9 }}>{theme}</p>
                  </div>
                </div>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              {/* Body: Media Player Area */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
                
                {centerResource ? (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    
                    {centerResource.videoUrl && (
                      <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>🎥 Video Dars</h3>
                        {centerResource.videoUrl.includes('youtube.com') || centerResource.videoUrl.includes('youtu.be') ? (
                          <iframe 
                            width="100%" 
                            height="315" 
                            src={centerResource.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={{ borderRadius: '12px' }}
                          ></iframe>
                        ) : (
                          <video controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} src={getMediaUrl(centerResource.videoUrl)} style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', background: '#000' }} />
                        )}
                      </div>
                    )}
                    
                    {centerResource.audioUrl && (
                      <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>🎵 Audio Material</h3>
                        <audio controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} src={getMediaUrl(centerResource.audioUrl)} style={{ width: '100%' }} />
                      </div>
                    )}

                    {centerResource.images && centerResource.images.length > 0 && (
                      <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>🖼️ Rasmlar Toʻplami</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                          {centerResource.images.map((img, i) => (
                            <img key={i} onContextMenu={(e) => e.preventDefault()} src={getMediaUrl(img)} alt="Resource" style={{ width: '100%', maxWidth: '800px', height: 'auto', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px', border: '2px solid #eee' }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {centerResource.slidesUrl && (
                      <div className="glass-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h3 style={{ margin: 0, color: '#333' }}>📄 Slayd / PDF</h3>
                        </div>
                        <object data={getMediaUrl(centerResource.slidesUrl)} type="application/pdf" width="100%" height="600px" style={{ borderRadius: '12px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
                          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '12px', color: '#555' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                            <p style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Aftidan brauzer bu formatdagi faylni toʻgʻridan-toʻgʻri ocholmaydi.</p>
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
