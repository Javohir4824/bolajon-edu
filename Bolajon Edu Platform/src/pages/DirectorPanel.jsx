import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  PartyPopper, 
  FileCheck, 
  LogOut, 
  TrendingUp, 
  MapPin, 
  Building2,
  Trash,
  BookCheck,
  Calendar
} from 'lucide-react';
import { mockData } from '../store';
import TopBar from '../components/TopBar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function DirectorPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data states
  const [activeTab, setActiveTab] = useState('stats');
  const [pupils, setPupils] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Teacher states
  const [newTName, setNewTName] = useState('');
  const [newTPass, setNewTPass] = useState('');
  const [newTGroup, setNewTGroup] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('directorAuth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsAuthenticated(true);
      setAuthData(parsed);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && authData) {
      fetchAllData(authData);
      const interval = setInterval(() => {
        fetchAllData(authData);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/directors');
      const directors = await res.json();
      const found = directors.find(d => d.username === username && d.password === password);
      
      if (found) {
        setIsAuthenticated(true);
        setAuthData(found);
        // Clear student session to avoid conflict
        localStorage.removeItem('user'); 
        localStorage.removeItem('bolajon_points');
        localStorage.setItem('directorAuth', JSON.stringify(found));
      } else {
        setLoginError('Login yoki parol xato!');
      }
    } catch (err) {
      setLoginError('Server bilan bog`lanib bo`lmadi');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('directorAuth');
    setIsAuthenticated(false);
    setAuthData(null);
    navigate('/');
  };

  const clean = (str) => String(str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  const [fetchError, setFetchError] = useState('');

  const fetchAllData = (auth) => {
    if (!auth) return;
    setLoading(true);
    setFetchError('');
    const endpoints = ['students', 'homeworks', 'events', 'teachers'];
    
    Promise.all(endpoints.map(ep => 
      fetch(`/api/${ep}`).then(r => {
        if (!r.ok) throw new Error(`${ep} topilmadi (${r.status})`);
        return r.json();
      })
    ))
      .then(([studentsData, hwData, evData, teachersData]) => {
        // Robust filtering: convert both to string and trim
        const c = (s) => String(s || '').trim();
        const filterFn = (item) => item && c(item.dmtt) === c(auth.dmtt);

        setPupils(studentsData.filter(filterFn));
        setHomeworks(hwData.filter(filterFn));
        setEvents(evData.filter(filterFn));
        setTeachers(teachersData.filter(filterFn));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setFetchError("Maʻlumotlarni yuklashda xatolik yuz berdi. Server ishlayotganini tekshiring.");
        setLoading(false);
      });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if(!newTName || !newTPass || !newTGroup) return alert("Hamma maydonlarni toʻldiring!");
    
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newTName,
          password: newTPass,
          group: newTGroup,
          viloyat: authData.viloyat,
          tuman: authData.tuman,
          dmtt: authData.dmtt
        })
      });
      if(res.ok) {
        setMsg("Yangi tarbiyachi muvaffaqiyatli qoʻshildi! 👩‍🏫");
        setNewTName(''); setNewTPass(''); setNewTGroup('');
        fetchAllData(authData);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch(e) { alert("Xatolik!"); }
  };

  const deleteHomework = async (id) => {
    if(window.confirm('Vazifani o`chirmoqchimisiz?')) {
      await fetch(`/api/homeworks/${id}`, { method: 'DELETE' });
      fetchAllData(authData);
    }
  };

  const deleteTeacher = async (id) => {
    if(window.confirm('Tarbiyachini o`chirmoqchimisiz?')) {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      fetchAllData(authData);
    }
  };

  const deletePupil = async (id) => {
    if(window.confirm('Tarbiyalanuvchi profilini o`chirmoqchimisiz?')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchAllData(authData);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff7ed' }}>
        <AnimatedBackground type="dashboard" />
        <motion.div 
          className="glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: '100%', maxWidth: '450px', padding: '40px', textAlign: 'center', zIndex: 10, background: 'rgba(255,255,255,0.95)' }}
        >
          <div style={{ background: '#fbbf24', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
            <Building2 size={40} />
          </div>
          <h2 style={{ marginBottom: '8px', color: '#92400e' }}>Mudira Boʻlimi</h2>
          <p style={{ color: '#b45309', marginBottom: '24px' }}>Bogʻcha faoliyatini kuzatish uchun kiring</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Login" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #fed7aa', marginBottom: '16px', fontSize: '1rem' }}
            />
            <input 
              type="password" 
              placeholder="Parol" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #fed7aa', marginBottom: '24px', fontSize: '1rem' }}
            />
            {loginError && <p style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 'bold' }}>{loginError}</p>}
            
            <button className="btn primary" style={{ width: '100%', padding: '16px', background: '#fbbf24', boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)' }}>
              Kirish ✨
            </button>
            <button type="button" onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#b45309', fontWeight: 'bold', cursor: 'pointer' }}>
              Ortga qaytish
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-layout" style={{ background: '#f8fafc' }}>
      <TopBar title={"Mudir Panel: " + (authData?.dmtt || '') + "-MTT"} hideBack={true} />
      
      <main className="main-content" style={{ padding: '20px' }}>
        {/* Profile Info */}
        {fetchError && (
          <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', border: '1px solid #fecaca', fontWeight: 'bold' }}>
            🚨 {fetchError}
          </div>
        )}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card" 
          style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '8px solid #fbbf24' }}
        >
          <div className="responsive-flex-between">
            <div>
               <h2 style={{ color: '#92400e', margin: 0 }}>Salom, {authData.username}! 👋</h2>
               <div style={{ display: 'flex', gap: '10px', marginTop: '8px', color: '#b45309', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14}/> {authData.viloyat}, {authData.tuman}
                  </span>
                  <span style={{ background: '#fef3c7', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={14}/> {authData.dmtt}-MTT Mudirasi 🎓
                  </span>
               </div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={18} /> Chiqish
            </button>
          </div>
        </motion.div>

        {/* Global DMTT Stats Cards */}
        <div className="responsive-grid-4" style={{ marginBottom: '30px' }}>
           <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <Users size={32} color="#fbbf24" style={{ margin: '0 auto 10px' }}/>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{pupils.length}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Tarbiyalanuvchi</p>
           </div>
           <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <FileCheck size={32} color="#10b981" style={{ margin: '0 auto 10px' }}/>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{homeworks.length}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Yuborilgan vazifalar</p>
           </div>
           <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <PartyPopper size={32} color="#ec4899" style={{ margin: '0 auto 10px' }}/>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{events.length}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Tadbirlar</p>
           </div>
           <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <TrendingUp size={32} color="#6366f1" style={{ margin: '0 auto 10px' }}/>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{pupils.reduce((acc, p) => acc + (p.points || 0), 0)}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Umumiy Yulduzlar</p>
           </div>
        </div>

        {/* TABS (Enhanced UI) */}
        {msg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '15px', background: '#dcfce7', color: '#166534', marginBottom: '20px', borderRadius: '15px', fontWeight: 'bold', textAlign: 'center', border: '1px solid #bbf7d0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>{msg}</motion.div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* Bolajonlar */}
            <motion.button 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('stats')} 
              style={{ padding: '24px', borderRadius: '20px', border: activeTab === 'stats' ? '3px solid #fbbf24' : '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: activeTab === 'stats' ? '0 15px 30px rgba(251,191,36,0.15)' : '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: activeTab === 'stats' ? '#fef3c7' : '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                <Users size={32} color="#fbbf24"/>
              </div>
              Bolajonlar
            </motion.button>

            {/* Tarbiyachilar */}
            <motion.button 
               whileHover={{ scale: 1.02, y: -5 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setActiveTab('teachers')} 
               style={{ padding: '24px', borderRadius: '20px', border: activeTab === 'teachers' ? '3px solid #f59e0b' : '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: activeTab === 'teachers' ? '0 15px 30px rgba(245,158,11,0.15)' : '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: activeTab === 'teachers' ? '#ffedd5' : '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                <Building2 size={32} color="#f59e0b"/>
              </div>
              Tarbiyachilar
            </motion.button>

            {/* Vazifalar */}
            <motion.button 
               whileHover={{ scale: 1.02, y: -5 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setActiveTab('homeworks')} 
               style={{ padding: '24px', borderRadius: '20px', border: activeTab === 'homeworks' ? '3px solid #6366f1' : '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: activeTab === 'homeworks' ? '0 15px 30px rgba(99,102,241,0.15)' : '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: activeTab === 'homeworks' ? '#e0e7ff' : '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                <BookCheck size={32} color="#6366f1"/>
              </div>
              Vazifalar
            </motion.button>

            {/* Tadbirlar */}
            <motion.button 
               whileHover={{ scale: 1.02, y: -5 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setActiveTab('events')} 
               style={{ padding: '24px', borderRadius: '20px', border: activeTab === 'events' ? '3px solid #ec4899' : '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: activeTab === 'events' ? '0 15px 30px rgba(236,72,153,0.15)' : '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: activeTab === 'events' ? '#fdf2f8' : '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                <Calendar size={32} color="#ec4899"/>
              </div>
              Tadbirlar
            </motion.button>
        </div>

        {/* CONTENT AREA */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'stats' && (
            <div className="glass-card" style={{ padding: '30px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>🧒 Bolajonlar Roʻyxati ({pupils.length} nafar)</h3>
                  <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px 16px', borderRadius: '50px', fontWeight: 'bold' }}>Sizning bogʻcha: {authData.dmtt}-MTT</div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                        <th style={{ padding: '16px' }}>Tarbiyalanuvchi</th>
                        <th style={{ padding: '16px' }}>Guruh</th>
                        <th style={{ padding: '16px' }}>Reyting</th>
                        <th style={{ padding: '16px' }}>Raqamli Maʻlumot</th>
                        <th style={{ padding: '16px' }}>Amallar</th>
                     </tr>
                  </thead>
                  <tbody>
                     {pupils.sort((a,b) => (b.points||0) - (a.points||0)).map((p, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                           <td style={{ padding: '16px' }}>
                              <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{p.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {p.id}</div>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <span style={{ padding: '4px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{p.group}</span>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontWeight: '900', fontSize: '1.1rem' }}>
                                 ⭐ {p.points || 0}
                              </div>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <div style={{ fontSize: '0.85rem', color: '#64748b' }}><strong>Login:</strong> {p.username}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b' }}><strong>Parol:</strong> {p.password}</div>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <button onClick={() => deletePupil(p.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>Oʻchirish</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              <div className="glass-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>👩‍🏫 Yangi Tarbiyachi qoʻshish</h3>
                <form onSubmit={handleAddTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
                   <div className="form-group" style={{ margin: 0 }}>
                      <label>F.I.SH (Tarbiyachi)</label>
                      <input type="text" value={newTName} onChange={e => setNewTName(e.target.value)} placeholder="Login nomi" style={{ width: '100%' }}/>
                   </div>
                   <div className="form-group" style={{ margin: 0 }}>
                      <label>Parol</label>
                      <input type="password" value={newTPass} onChange={e => setNewTPass(e.target.value)} placeholder="Parol" style={{ width: '100%' }}/>
                   </div>
                   <div className="form-group" style={{ margin: 0 }}>
                      <label>Guruh</label>
                      <select value={newTGroup} onChange={e => setNewTGroup(e.target.value)} style={{ width: '100%' }}>
                         <option value="">-- Tanlang --</option>
                         {mockData.adminGroups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                   </div>
                   <button type="submit" className="btn primary" style={{ background: '#f59e0b', height: '50px' }}>Qoʻshish вћ•</button>
                </form>
              </div>

              <div className="glass-card">
                 <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📋 Xodimlar roʻyxati</h3>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                       <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                          <th style={{ padding: '12px' }}>Tarbiyachi</th>
                          <th style={{ padding: '12px' }}>Guruhi</th>
                          <th style={{ padding: '12px' }}>Amal</th>
                       </tr>
                    </thead>
                    <tbody>
                       {teachers.map((t, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                             <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.username}</td>
                             <td style={{ padding: '12px' }}><span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '6px' }}>{t.group}</span></td>
                             <td style={{ padding: '12px' }}>
                               <button onClick={() => deleteTeacher(t.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Oʻchirish</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeTab === 'homeworks' && (
             <div style={{ display: 'grid', gap: '16px' }}>
                {homeworks.map(hw => (
                   <div key={hw.id} className="responsive-flex-between glass-card">
                      <div>
                         <h4 style={{ margin: 0, color: '#1e293b' }}>{hw.studentName} ({hw.group})</h4>
                         <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>{hw.theme} | {hw.center} | {hw.time}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer" className="btn primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>Koʻrish</a>
                        <button onClick={() => deleteHomework(hw.id)} className="btn" style={{ background: '#fee2e2', color: '#ef4444' }}><Trash size={18}/></button>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {activeTab === 'events' && (
             <div className="responsive-grid-2">
                {events.map(ev => (
                   <div key={ev.id} className="glass-card">
                      <h4 style={{ margin: 0, color: '#1e293b' }}>{ev.title} ({ev.group})</h4>
                      <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#94a3b8' }}> Ustoz: {ev.teacherName} | {ev.createdAt}</p>
                      <p style={{ margin: '10px 0', fontSize: '0.95rem', color: '#475569' }}>{ev.description}</p>
                      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                         {ev.media && ev.media.map((m, idx) => (
                            <img key={idx} src={m.url} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
