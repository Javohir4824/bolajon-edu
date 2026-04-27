import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, Save, Users, FilePlus, Trash, Edit, CheckCircle, ExternalLink, Lock } from 'lucide-react';

import { mockData } from '../store';

export default function SuperAdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [superUsername, setSuperUsername] = useState('');
  const [superPassword, setSuperPassword] = useState('');

  const [activeTab, setActiveTab] = useState('upload');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success'); 
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [employeeType, setEmployeeType] = useState('teacher');

  const [logs, setLogs] = useState([]);
  const [resources, setResources] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [events, setEvents] = useState([]);
  const [directors, setDirectors] = useState([]);

  // Upload states
  const [month, setMonth] = useState('Sentyabr');
  const [week, setWeek] = useState('1-hafta');
  const [theme, setTheme] = useState(mockData.months[0].themes[0]);
  const [center, setCenter] = useState('Qurish-yasash va matematika');
  const [resGroup, setResGroup] = useState(mockData.adminGroups[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [images, setImages] = useState([]);
  const [slidesUrl, setSlidesUrl] = useState('');

  // Teacher Creation States
  const [tViloyat, setTViloyat] = useState(mockData.viloyats[0]);
  const [tTuman, setTTuman] = useState(mockData.tumans[mockData.viloyats[0]][0]);
  const [tDmtt, setTDmtt] = useState('1');
  const [tGroup, setTGroup] = useState(mockData.groups[0]);
  const [tUsername, setTUsername] = useState('');
  const [tPassword, setTPassword] = useState('');

  // Event Viewer Filter States
  const [eViloyat, setEViloyat] = useState('all');
  const [eTuman, setETuman] = useState('');
  const [eDmtt, setEDmtt] = useState('');

  // Homework Viewer Filter States
  const [hViloyat, setHViloyat] = useState('all');
  const [hTuman, setHTuman] = useState('');
  const [hDmtt, setHDmtt] = useState('');

  const [students, setStudents] = useState([]);

  useEffect(() => {
    setTUsername('');
    setTPassword('');
  }, [employeeType]);

  useEffect(() => {
    if (localStorage.getItem('superAdminAuth') === 'true' && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAll = () => {
        fetchLogs(); fetchResources(); fetchHomeworks(); fetchTeachers(); 
        fetchEvents(); fetchDirectors(); fetchStudents();
      };
      fetchAll();
      const interval = setInterval(fetchAll, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleSuperLogin = (e) => {
    e.preventDefault();
    if (superUsername === 'M@CinTo$h' && superPassword === '8937344334') {
      setIsAuthenticated(true);
      localStorage.setItem('superAdminAuth', 'true');
    } else {
      alert("Xato: Oliy admin huquqlariga ega emassiz.");
    }
  };

  const fetchStudents = async () => {
    try { const r = await fetch('/api/students'); setStudents(await r.json() || []); } catch (e) { }
  };
  const fetchLogs = async () => {
    try { const r = await fetch('/api/logs'); setLogs(await r.json()); } catch (e) { }
  };
  const fetchHomeworks = async () => {
    try { const r = await fetch('/api/homeworks'); setHomeworks(await r.json()); } catch (e) { }
  };
  const fetchResources = async () => {
    try { const r = await fetch('/api/resources'); setResources(await r.json()); } catch (e) { }
  };
  const fetchTeachers = async () => {
    try { const r = await fetch('/api/teachers'); setTeachers(await r.json()); } catch (e) { }
  };
  const fetchEvents = async () => {
    try { const r = await fetch('/api/events'); setEvents(await r.json()); } catch (e) { }
  };
  const fetchDirectors = async () => {
    try { const r = await fetch('/api/directors'); setDirectors(await r.json() || []); } catch (e) { }
  };


  const handleDeleteEvent = async (id) => {
    if (window.confirm('Tadbirni o`chirmoqchimisiz?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData(); formData.append('file', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (type === 'video') setVideoUrl(data.url);
      else if (type === 'audio') setAudioUrl(data.url);
      else if (type === 'slide') setSlidesUrl(data.url);
      else if (type === 'image') setImages([...images, data.url]);
    } catch (err) { alert('Yuklashda xatolik'); } finally { setUploading(false); }
  };

  const handleSaveResource = async () => {
    if (!theme) {
      setMsgType('error');
      setMsg('Iltimos, hafta mavzusini kiriting!');
      return;
    }
    const payload = { month, week, theme, center, group: resGroup, videoUrl, audioUrl, images, slidesUrl };
    try {
      if (editingId) {
        await fetch(`/api/resources/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setEditingId(null);
      } else {
        await fetch('/api/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setMsgType('success');
      setMsg('Saqlandi! ✅');
      setVideoUrl(''); setAudioUrl(''); setImages([]); setSlidesUrl('');
      fetchResources();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { 
      setMsgType('error');
      setMsg('Xatolik yuz berdi.'); 
      setTimeout(() => setMsg(''), 5000);
    }
  };

  const clean = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  const handleDeleteResource = async (id) => {
    if (window.confirm('Rostdan ham o`chirmoqchimisiz?')) {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      fetchResources();
    }
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!tUsername || !tPassword) return alert("Login va parolni kiriting");
    const payload = { username: tUsername, password: tPassword, viloyat: tViloyat, tuman: tTuman, dmtt: tDmtt, group: tGroup };
    try {
      await fetch('/api/teachers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setMsg("Tarbiyachi tizimdan roʻyxatdan oʻtdi ✅");
      setTUsername(''); setTPassword('');
      fetchTeachers();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { alert("Xato"); }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Haqiqatan ham o`chirib tashlaysizmi?')) {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      fetchTeachers();
    }
  };

  const handleSaveDirector = async (e) => {
    e.preventDefault();
    if (!tUsername || !tPassword) return alert("Login va parolni kiriting");
    const payload = { username: tUsername, password: tPassword, viloyat: tViloyat, tuman: tTuman, dmtt: tDmtt };
    try {
      await fetch('/api/directors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setMsg("Mudira tizimdan roʻyxatdan oʻtdi ✅");
      setTUsername(''); setTPassword('');
      fetchDirectors();
      setTimeout(() => setMsg(''), 3000);
    } catch(err) { alert("Xato"); }
  };

  const handleDeleteDirector = async (id) => {
    if (window.confirm('Mudira profilini o`chirmoqchimisiz?')) {
      await fetch(`/api/directors/${id}`, { method: 'DELETE' });
      fetchDirectors();
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Bolajon haqidagi barcha ma`lumotlarni o`chirib tashlaysizmi?')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  const handleDeleteHomework = async (id) => {
    if (window.confirm('Bu vazifani tizimdan butunlay o`chirmoqchimisiz?')) {
      await fetch(`/api/homeworks/${id}`, { method: 'DELETE' });
      fetchHomeworks();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e0e7ff' }}>
        <form onSubmit={handleSuperLogin} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '90%', borderTop: '8px solid #4f46e5' }}>
          <div style={{ background: '#eef2ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', margin: '0 auto 20px' }}>
            <Lock size={40} />
          </div>
          <h2 style={{ marginBottom: '10px', color: '#312e81' }}>Super Admin tizimi</h2>
          <p style={{ color: '#6366f1', marginBottom: '24px', fontWeight: 'bold' }}>Faqatgina bosh maʻmurlar uchun</p>

          <input
            type="text"
            placeholder="Login"
            value={superUsername}
            onChange={e => setSuperUsername(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #c7d2fe', fontSize: '1.1rem', textAlign: 'center', marginBottom: '16px' }}
          />

          <input
            type="password"
            placeholder="Parol"
            value={superPassword}
            onChange={e => setSuperPassword(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #c7d2fe', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px', marginBottom: '24px' }}
          />

          <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', padding: '16px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            Tizimga Kirish
          </button>

          <button type="button" onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Ortga qaytish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '1000px', position: 'relative', marginTop: '20px' }}>

        <button
          onClick={() => {
            localStorage.removeItem('superAdminAuth');
            navigate('/');
          }}
          className="btn"
          style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px', background: 'var(--danger)', fontSize: '0.9rem', boxShadow: 'none' }}
        >
          Chiqish
        </button>

        <h1 style={{ marginBottom: '32px', color: 'var(--secondary)', textAlign: 'center', fontSize: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <span style={{ fontSize: '3rem' }}>👑</span> Oliy Boshqaruv
        </h1>

        <div className="responsive-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          {[
            { id: 'upload', icon: '📚', label: 'Darsliklar' },
            { id: 'teachers', icon: '👥', label: 'Xodimlar' },
            { id: 'stats', icon: '📊', label: 'Reyting' },
            { id: 'pupils', icon: '🧒', label: 'Bolajonlar' },
            { id: 'dmtts', icon: '🏢', label: 'Bogʻchalar' },
            { id: 'homeworks', icon: '📥', label: 'Vazifalar' },
            { id: 'events', icon: '🎉', label: 'Tadbirlar' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              style={{ 
                padding: '12px 20px', 
                borderRadius: '50px', 
                border: 'none', 
                background: activeTab === tab.id ? 'var(--secondary)' : 'white', 
                color: activeTab === tab.id ? 'white' : '#555', 
                fontWeight: '800', 
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0,177,255,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {msg && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            style={{ 
              padding: '15px', 
              background: msgType === 'error' ? 'var(--danger)' : 'var(--success)', 
              color: 'white', 
              marginBottom: '20px', 
              borderRadius: '15px', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              boxShadow: msgType === 'error' ? '0 5px 15px rgba(255,90,90,0.3)' : '0 5px 15px rgba(44,214,82,0.3)' 
            }}
          >
            {msg}
          </motion.div>
        )}

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ marginBottom: '25px', color: 'var(--text-dark)', borderLeft: '5px solid var(--primary)', paddingLeft: '15px' }}>📚 Global Darsliklar Yuklash</h2>
            
            <div className="responsive-grid-4" style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label>Oy</label>
                <select value={month} onChange={e => setMonth(e.target.value)}>
                  {mockData.months.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Hafta</label>
                <select value={week} onChange={e => setWeek(e.target.value)}>
                  {['1-hafta', '2-hafta', '3-hafta', '4-hafta'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Guruh</label>
                <select value={resGroup} onChange={e => setResGroup(e.target.value)}>
                  {mockData.adminGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Mavzu</label>
                <input type="text" placeholder="Mavzu nomi..." value={theme} onChange={e => setTheme(e.target.value)} />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label>Markaz</label>
              <select value={center} onChange={e => setCenter(e.target.value)}>
                <option>Qurish-yasash va matematika</option>
                <option>Syujetli rolli oʻyinlar va dramalash</option>
                <option>Til va nutq</option>
                <option>Fan va tabiat</option>
                <option>Sanʻat markazi</option>
              </select>
            </div>

            <div className="responsive-grid-4" style={{ marginBottom: '30px', gap: '15px' }}>
               <div className="media-uploader" style={{ padding: '20px' }}>
                  <input type="file" onChange={e => handleFileUpload(e, 'video')} style={{ display: 'none' }} id="vid"/>
                  <label htmlFor="vid" style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎥</div>
                    Video {videoUrl ? '✅' : '+'}
                  </label>
               </div>
               <div className="media-uploader" style={{ padding: '20px' }}>
                  <input type="file" onChange={e => handleFileUpload(e, 'audio')} style={{ display: 'none' }} id="aud"/>
                  <label htmlFor="aud" style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎵</div>
                    Audio {audioUrl ? '✅' : '+'}
                  </label>
               </div>
               <div className="media-uploader" style={{ padding: '20px' }}>
                  <input type="file" onChange={e => handleFileUpload(e, 'image')} style={{ display: 'none' }} id="img"/>
                  <label htmlFor="img" style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🖼️</div>
                    Rasm {images.length > 0 ? `(${images.length})` : '+'}
                  </label>
               </div>
               <div className="media-uploader" style={{ padding: '20px' }}>
                  <input type="file" onChange={e => handleFileUpload(e, 'slide')} style={{ display: 'none' }} id="pdf"/>
                  <label htmlFor="pdf" style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📄</div>
                    PDF {slidesUrl ? '✅' : '+'}
                  </label>
               </div>
            </div>

            <button onClick={handleSaveResource} className="btn primary" style={{ width: '100%', padding: '20px' }}>
              Materialni Saqlash ✅
            </button>
          </motion.div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'teachers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
               <button onClick={() => setEmployeeType('teacher')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: employeeType === 'teacher' ? '#4f46e5' : '#f1f5f9', color: employeeType === 'teacher' ? 'white' : '#666', fontWeight: 'bold' }}>Tarbiyachilar Nazorati</button>
               <button onClick={() => setEmployeeType('director')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: employeeType === 'director' ? '#4f46e5' : '#f1f5f9', color: employeeType === 'director' ? 'white' : '#666', fontWeight: 'bold' }}>Mudiralar Nazorati</button>
            </div>

            {employeeType === 'teacher' ? (
              <div className="glass-card">
                 <h3 style={{ marginBottom: '16px' }}>👩‍🏫 Tizimdagi barcha tarbiyachilar ({teachers.length})</h3>
                 
                 <form onSubmit={handleSaveTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px', background: '#f0f9ff', padding: '15px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <input placeholder="Login" value={tUsername} onChange={e => setTUsername(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <input placeholder="Parol" value={tPassword} onChange={e => setTPassword(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <select value={tViloyat} onChange={e => { setTViloyat(e.target.value); if(mockData.tumans[e.target.value]) setTTuman(mockData.tumans[e.target.value][0]); }} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                       {mockData.viloyats.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select value={tTuman} onChange={e => setTTuman(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                       {(mockData.tumans[tViloyat] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input placeholder="DMTT raqami" value={tDmtt} onChange={e => setTDmtt(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <select value={tGroup} onChange={e => setTGroup(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                       {mockData.groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <button type="submit" style={{ padding: '10px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Qoʻshish +</button>
                 </form>

                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                       <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                          <th style={{ padding: '10px' }}>Ismi</th>
                          <th style={{ padding: '10px' }}>Hudud</th>
                          <th style={{ padding: '10px' }}>DMTT/Guruh</th>
                          <th style={{ padding: '10px' }}>Amal</th>
                       </tr>
                    </thead>
                    <tbody>
                       {teachers.map(t => (
                         <tr key={t.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.username}</td>
                            <td style={{ padding: '10px', fontSize: '0.85rem' }}>{t.viloyat}, {t.tuman}</td>
                            <td style={{ padding: '10px' }}>{t.dmtt}-MTT / {t.group}</td>
                            <td style={{ padding: '10px' }}>
                               <button onClick={() => handleDeleteTeacher(t.id)} style={{ padding: '5px 10px', background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '4px' }}>Oʻchirish</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            ) : (
              <div className="glass-card">
                 <h2 style={{ marginBottom: '16px' }}>🏢 Bogʻcha Mudiralari ({directors.length})</h2>
                 <form onSubmit={handleSaveDirector} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px', background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                    <input placeholder="Login" value={tUsername} onChange={e => setTUsername(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <input placeholder="Parol" value={tPassword} onChange={e => setTPassword(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <select value={tViloyat} onChange={e => { setTViloyat(e.target.value); if(mockData.tumans[e.target.value]) setTTuman(mockData.tumans[e.target.value][0]); }} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                       {mockData.viloyats.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select value={tTuman} onChange={e => setTTuman(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                       {(mockData.tumans[tViloyat] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input placeholder="DMTT raqami" value={tDmtt} onChange={e => setTDmtt(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
                    <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Qoʻshish +</button>
                 </form>

                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                       <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                          <th style={{ padding: '10px' }}>Mudir/Mudira</th>
                          <th style={{ padding: '10px' }}>Hudud</th>
                          <th style={{ padding: '10px' }}>DMTT</th>
                          <th style={{ padding: '10px' }}>Amal</th>
                       </tr>
                    </thead>
                    <tbody>
                       {directors.map(d => (
                         <tr key={d.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#4338ca' }}>{d.username}</td>
                            <td style={{ padding: '10px', fontSize: '0.85rem' }}>{d.viloyat}, {d.tuman}</td>
                            <td style={{ padding: '10px' }}><strong>{d.dmtt}-MTT</strong></td>
                            <td style={{ padding: '10px' }}>
                               <button onClick={() => handleDeleteDirector(d.id)} style={{ padding: '5px 10px', background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '4px' }}>Oʻchirish</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            )}
          </motion.div>
        )}

        {/* BOLAJONLAR BAZASI TAB */}
        {activeTab === 'pupils' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '20px', color: '#4338ca' }}>🧒 Roʻyxatdan oʻtgan barcha bolajonlar ({students.length})</h2>
            <div className="glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '10px' }}>F.I.SH</th>
                    <th style={{ padding: '10px' }}>Hudud</th>
                    <th style={{ padding: '10px' }}>DMTT/Guruh</th>
                    <th style={{ padding: '10px' }}>Login/Parol</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.name}</td>
                      <td style={{ padding: '10px', fontSize: '0.85rem' }}>{s.viloyat}, {s.tuman}</td>
                      <td style={{ padding: '10px' }}>{s.dmtt}-MTT / {s.group}</td>
                      <td style={{ padding: '10px', fontSize: '0.9rem', color: '#4f46e5' }}>
                        <strong>L:</strong> {s.username} | <strong>P:</strong> {s.password}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Xali bolajonlar roʻyxatdan oʻtmagan.</p>}
            </div>
          </motion.div>
        )}

        {/* DMTT MANAGEMENT TAB (Bogʻchalar Global Boshqaruvi) */}
        {activeTab === 'dmtts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '20px', color: '#4338ca' }}>🏢 Barcha Bogʻchalar va Mudiralar Nazorati ({directors.length} ta)</h2>
            <div className="responsive-grid-2">
               {directors.map(d => {
                 // Mudiraga tegishli tarbiyachi va bolajonlarni hisoblash
                 const c = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                 const schoolTeachers = teachers.filter(t => c(t.dmtt) === c(d.dmtt) && c(t.viloyat) === c(d.viloyat));
                 const schoolPupils = students.filter(s => c(s.dmtt) === c(d.dmtt) && c(s.viloyat) === c(d.viloyat));
                 
                 return (
                    <div key={d.id} className="glass-card" style={{ borderLeft: '6px solid #4f46e5', position: 'relative' }}>
                       <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <button onClick={() => handleDeleteDirector(d.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444' }}><Trash size={18}/></button>
                       </div>
                       <h3 style={{ margin: 0, color: '#1e293b' }}>{d.dmtt}-MTT ( {d.tuman} )</h3>
                       <p style={{ color: '#6366f1', margin: '5px 0', fontSize: '1.1rem' }}>Mudira: <strong>{d.username}</strong></p>
                       <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>{d.viloyat}, {d.tuman}</p>
                       
                       <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                          <span style={{ fontSize: '0.9rem', background: '#eef2ff', color: '#4338ca', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
                            👩‍🏫 {schoolTeachers.length} Tarbiyachi
                          </span>
                          <span style={{ fontSize: '0.9rem', background: '#fff7ed', color: '#c2410c', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
                            🧒 {schoolPupils.length} Bolajon
                          </span>
                       </div>
                    </div>
                 );
               })}
               {directors.length === 0 && <p style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px' }}>Hali mudiralar qoʻshilmagan.</p>}
            </div>
          </motion.div>
        )}

        {/* Global Statistics */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '20px', color: '#4338ca' }}>📊 Global Reyting (Barcha roʻyxatdan oʻtgan bolajonlar)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                     <th style={{ padding: '10px' }}>Ism</th>
                     <th style={{ padding: '10px' }}>Hudud</th>
                     <th style={{ padding: '10px' }}>MTT / Guruh</th>
                     <th style={{ padding: '10px' }}>Reyting</th>
                     <th style={{ padding: '10px' }}>Amal</th>
                  </tr>
               </thead>
               <tbody>
                  {students.sort((a,b) => (b.points||0) - (a.points||0)).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                       <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                       <td style={{ padding: '10px', fontSize: '0.85rem' }}>{p.viloyat}, {p.tuman}</td>
                       <td style={{ padding: '10px' }}>{p.dmtt}-MTT / {p.group}</td>
                       <td style={{ padding: '10px', color: '#f59e0b', fontWeight: 'bold' }}>⭐ {p.points || 0}</td>
                       <td style={{ padding: '10px' }}>
                          <button onClick={() => handleDeleteStudent(p.id)} title="Oʻchirish" style={{ background: 'transparent', border: 'none', color: '#ef4444' }}><Trash size={16}/></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </motion.div>
        )}

        {/* Homeworks View */}
        {activeTab === 'homeworks' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#4338ca' }}>📥 Bogʻchalardagi Yuborilgan Vazifalar ({homeworks.length} ta)</h2>

            <div className="responsive-grid-3" style={{ marginBottom: '32px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Viloyat</label>
                <select value={hViloyat} onChange={e => { setHViloyat(e.target.value); setHTuman(''); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="all">Barchasi (Global)</option>
                  {mockData.viloyats.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tuman</label>
                <select value={hTuman} onChange={e => setHTuman(e.target.value)} disabled={hViloyat === 'all'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="">Barcha tumanlar</option>
                  {(mockData.tumans[hViloyat] || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>DMTT raqami</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={hDmtt} disabled={hViloyat === 'all'} onChange={e => setHDmtt(e.target.value)} placeholder="Barchasi" style={{ width: '100%', padding: '10px 45px 10px 10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>DMTT</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {homeworks
                .filter(hw => {
                  if (hViloyat === 'all') return true;
                  const vMatch = clean(hw.viloyat) === clean(hViloyat);
                  const tMatch = hTuman ? clean(hw.tuman) === clean(hTuman) : true;
                  const dMatch = hDmtt ? clean(hw.dmtt) === clean(hDmtt) : true;
                  return vMatch && tMatch && dMatch;
                })
                .map(hw => (
                  <div key={hw.id} className="responsive-flex-between" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>{hw.studentName} ({hw.viloyat}, {hw.tuman}, {hw.dmtt}-MTT, {hw.group})</h3>
                      <p style={{ margin: '4px 0', color: '#475569' }}><strong>Mavzu:</strong> {hw.theme} ({hw.month}) - {hw.center}</p>
                      {hw.week && <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}><strong>Hafta:</strong> {hw.week}</p>}
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Vaqt: {hw.time}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                        Koʻrish 👁️
                      </a>
                      <button onClick={() => handleDeleteHomework(hw.id)} style={{ padding: '10px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              {homeworks.length === 0 && (
                <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Tizimda hali vazifalar mavjud emas.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'events' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#4338ca' }}>Bogʻchalardagi Bayram va Tadbirlar</h2>

            <div className="responsive-grid-3" style={{ marginBottom: '32px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Viloyat</label>
                <select value={eViloyat} onChange={e => { setEViloyat(e.target.value); setETuman(''); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="all">Barchasi (Global)</option>
                  {mockData.viloyats.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tuman</label>
                <select value={eTuman} onChange={e => setETuman(e.target.value)} disabled={eViloyat === 'all'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="">Barcha tumanlar</option>
                  {(mockData.tumans[eViloyat] || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>DMTT (Bogʻcha)</label>
                <input type="number" value={eDmtt} disabled={eViloyat === 'all'} onChange={e => setEDmtt(e.target.value)} placeholder="Barchasi" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div className="responsive-grid-2">
              {events
                .filter(ev => {
                  if (eViloyat === 'all') return true;
                  const vMatch = clean(ev.viloyat) === clean(eViloyat);
                  const tMatch = eTuman ? clean(ev.tuman) === clean(eTuman) : true;
                  const dMatch = eDmtt ? clean(ev.dmtt) === clean(eDmtt) : true;
                  return vMatch && tMatch && dMatch;
                })
                .map(ev => (
                  <div key={ev.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <div className="responsive-flex-between" style={{ marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: '#1e293b' }}>{ev.title} ({ev.group})</h3>
                      <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={20} /></button>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>Ustoz: {ev.teacherName} | {ev.viloyat}, {ev.tuman} | {ev.createdAt}</p>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>{ev.description}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {ev.media && ev.media.map((m, idx) => (
                        m.type === 'image'
                          ? <img key={idx} src={m.url} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                          : <div key={idx} style={{ width: '70px', height: '70px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>VIDEO</div>
                      ))}
                    </div>
                  </div>
                ))}
              {events.length === 0 && (
                  <p style={{ color: '#666', textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>Hali tadbirlar yuklanmagan.</p>
                )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
